'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Helper to construct normalized orders correctly from DB
  const normalizeOrder = (dbOrder) => ({
    id: dbOrder.id,
    tableNumber: dbOrder.table_number,
    floor: dbOrder.floor,
    customer_name: dbOrder.customer_name,
    customer_phone: dbOrder.customer_phone,
    status: dbOrder.status,
    total: dbOrder.total,
    paymentStatus: dbOrder.payment_status,
    paymentMethod: dbOrder.payment_method,
    notes: dbOrder.notes,
    createdAt: dbOrder.created_at,
    updatedAt: dbOrder.updated_at,
    type: dbOrder.notes === 'CALL_STAFF' ? 'call_staff' : 'order',
    resolved: dbOrder.status === 'served', 
    items: dbOrder.order_items?.map(i => ({
      id: i.item_id,
      name: i.name,
      price: i.price,
      quantity: i.quantity
    })) || []
  });

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    
    if (data) {
      setOrders(data.map(normalizeOrder));
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();

    // Set up realtime subscription
    const channel = supabase
      .channel('orders_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, fetchOrders)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const placeOrder = async (orderData) => {
    // 1. Insert Order
    const { data: newOrderData, error } = await supabase.from('orders').insert({
      customer_name: orderData.guestName || 'Guest',
      customer_phone: orderData.guestPhone || null,
      table_number: orderData.tableNumber,
      floor: orderData.floor,
      status: 'placed',
      total: orderData.total || 0,
      payment_method: orderData.paymentMethod || 'UPI',
      payment_status: 'paid', // Fake Razorpay succeeds
      notes: orderData.specialInstructions || null,
    }).select().single();

    if (error || !newOrderData) {
      console.error(error);
      throw new Error('Failed to place order');
    }

    // 2. Insert Items if exist
    if (orderData.items && orderData.items.length > 0) {
      const dbItems = orderData.items.map(i => ({
        order_id: newOrderData.id,
        item_id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity
      }));
      await supabase.from('order_items').insert(dbItems);
    }

    // Return locally formatted order
    const formatted = normalizeOrder({ ...newOrderData, order_items: orderData.items || [] });
    setCurrentOrder(formatted);
    // Optimistically update orders list to instantly track without waiting for Websocket
    setOrders(prev => [formatted, ...prev]);
    return formatted;
  };

  const updateOrderStatus = async (orderId, status) => {
    await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId);
  };

  const confirmPayment = async (orderId) => {
    await supabase.from('orders').update({ 
      payment_status: 'paid', 
      status: 'confirmed', 
      updated_at: new Date().toISOString() 
    }).eq('id', orderId);
  };

  const getOrder = (orderId) => orders.find(o => o.id === orderId);

  const activeOrders = orders.filter(
    o => o.type !== 'call_staff' && !['served', 'cancelled'].includes(o.status)
  );
  
  const callStaffAlerts = orders.filter(o => o.type === 'call_staff' && !o.resolved);

  const addCallStaffAlert = async (tableNumber, floor) => {
    await supabase.from('orders').insert({
      customer_name: 'Table Calling',
      table_number: tableNumber,
      floor: floor,
      status: 'placed',
      total: 0,
      notes: 'CALL_STAFF'
    });
  };

  const resolveCallStaff = async (alertId) => {
    await supabase.from('orders').update({ status: 'served', updated_at: new Date().toISOString() }).eq('id', alertId);
  };

  return (
    <OrderContext.Provider value={{
      orders, currentOrder, setCurrentOrder,
      activeOrders, callStaffAlerts,
      placeOrder, updateOrderStatus, confirmPayment,
      getOrder, addCallStaffAlert, resolveCallStaff,
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
};
