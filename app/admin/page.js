'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOrder } from '../../lib/orderContext';
import { supabase } from '../../lib/supabase';
import ToastContainer, { toast } from '../../components/Toast';
import styles from './page.module.css';

export default function AdminPage() {
  const router = useRouter();
  const { orders } = useOrder();
  const [tab, setTab] = useState('analytics');
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'coffee', description: '', tags: [] });

  useEffect(() => {
    const stored = localStorage.getItem('core_cafe_user');
    if (!stored) {
      router.replace('/login');
      return;
    }

    let u;
    try {
      u = JSON.parse(stored);
    } catch {
      router.replace('/login');
      return;
    }
    if (u.role !== 'manager') {
      router.replace('/login');
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(u);
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    async function loadData() {
      const [{ data: cats }, { data: items }, { data: tbls }] = await Promise.all([
        supabase.from('categories').select('*').order('sort'),
        supabase.from('menu_items').select('*'),
        supabase.from('tables').select('*').order('number')
      ]);
      if (cats) setCategories(cats);
      if (items) setMenuItems(items);
      if (tbls) setTables(tbls);
    }
    loadData();
  }, [authChecked]);

  const realOrders = orders.filter(o => o.type !== 'call_staff');
  const todayRevenue = realOrders
    .filter(o => o.paymentStatus === 'paid' || o.status !== 'placed')
    .reduce((s, o) => s + (o.total || 0), 0);
  
  const topItems = menuItems.map(item => ({
    ...item,
    orderCount: realOrders.reduce((s, o) => s + (o.items?.find(i => i.id === item.id)?.quantity || 0), 0),
  })).sort((a, b) => b.orderCount - a.orderCount).slice(0, 5);

  const toggleAvailability = async (id) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    const newAvail = !item.available;

    const { error } = await supabase.from('menu_items').update({ available: newAvail }).eq('id', id);
    if (error) {
      console.error('Update error:', error);
      toast(`Failed to update: ${error.message}`, 'error');
      return;
    }

    setMenuItems(prev => prev.map(i => i.id === id ? { ...i, available: newAvail } : i));
    toast('Item availability updated', 'success');
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) { toast('Name and price are required', 'error'); return; }
    const insertData = {
      id: `custom_${Date.now()}`,
      category_id: newItem.category,
      name: newItem.name,
      price: Number(newItem.price),
      description: newItem.description,
      available: true,
      tags: []
    };
    
    // Attempt DB insert first
    const { error } = await supabase.from('menu_items').insert(insertData);
    
    if (error) {
      console.error('Insert error:', error);
      toast(`Failed to save: ${error.message}`, 'error');
      return;
    }

    // Update UI on success
    setMenuItems(prev => [...prev, insertData]);
    setNewItem({ name: '', price: '', category: 'coffee', description: '', tags: [] });
    toast('Menu item added!', 'success');
  };

  const handleDeleteItem = async (id) => {
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) {
      console.error('Delete error:', error);
      toast(`Failed to delete: ${error.message}`, 'error');
      return;
    }

    setMenuItems(prev => prev.filter(i => i.id !== id));
    toast('Item removed from menu', 'success');
  };

  const TABS = [
    { id: 'analytics', label: '📊 Analytics' },
    { id: 'menu',      label: '☕ Menu' },
    { id: 'tables',    label: '📍 Tables & QR' },
    { id: 'orders',    label: '🍽️ Orders' },
  ];

  if (!authChecked) return null;

  return (
    <div className={styles.page}>
      <ToastContainer />

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoCore}>CORE</span>
          <span className={styles.logoCafe}>cafe</span>
          <span className={styles.adminBadge}>Admin</span>
        </div>

        <nav className={styles.sideNav}>
          <Link href="/dashboard" className={styles.navItem}>
            <span>🍽️</span> Dashboard
          </Link>
          <Link href="/admin" className={`${styles.navItem} ${styles.navActive}`}>
            <span>📊</span> Admin
          </Link>
          <Link href="/menu" className={styles.navItem}>
            <span>☕</span> Menu
          </Link>
          <button
            className={`${styles.navItem} ${styles.logoutBtn}`}
            onClick={() => {
              localStorage.removeItem('core_cafe_user');
              router.replace('/login');
            }}
          >
            <span>🚪</span> Logout
          </button>
        </nav>

        <div className={styles.sidebarUser}>
          <div className={styles.userAvatar}>{user?.name?.[0] || 'M'}</div>
          <div>
            <div className={styles.userName}>{user?.name || 'Manager'}</div>
            <div className={styles.userRole}>Manager / Owner</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>Admin Dashboard</h1>
            <p className={styles.pageSubtitle}>Manage your cafe operations</p>
          </div>
        </div>

        {/* Tab Bar */}
        <div className={styles.tabBar}>
          {TABS.map(t => (
            <button
              key={t.id}
              className={`${styles.tabBtn} ${tab === t.id ? styles.tabBtnActive : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Analytics ── */}
        {tab === 'analytics' && (
          <div className={styles.section}>
            <div className={styles.analyticsGrid}>
              {[
                { label: 'Today\'s Revenue', value: `₹${todayRevenue}`, icon: '💰', cls: styles.goldCard },
                { label: 'Total Orders', value: realOrders.length, icon: '📦', cls: '' },
                { label: 'Active Orders', value: realOrders.filter(o => !['served','cancelled'].includes(o.status)).length, icon: '🔥', cls: '' },
                { label: 'Menu Items', value: menuItems.filter(i => i.available).length, icon: '☕', cls: '' },
              ].map(s => (
                <div key={s.label} className={`${styles.analyticsCard} ${s.cls}`}>
                  <span className={styles.analyticsIcon}>{s.icon}</span>
                  <span className={styles.analyticsValue}>{s.value}</span>
                  <span className={styles.analyticsLabel}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className={styles.topItemsCard}>
              <h3 className="heading-md">Top Selling Items</h3>
              <div className={styles.topItemsList}>
                {topItems.map((item, i) => (
                  <div key={item.id} className={styles.topItem}>
                    <span className={styles.topItemRank}>#{i + 1}</span>
                    <span className={styles.topItemName}>{item.name}</span>
                    <span className={styles.topItemCount}>{item.orderCount} orders</span>
                    <span className={styles.topItemPrice}>₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Menu Manager ── */}
        {tab === 'menu' && (
          <div className={styles.section}>
            {/* Add Item Form */}
            <div className={styles.addItemForm}>
              <h3 className="heading-md">Add New Item</h3>
              <div className={styles.addFormGrid}>
                <input className="input-field" placeholder="Item name" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} />
                <input className="input-field" type="number" placeholder="Price (₹)" value={newItem.price} onChange={e => setNewItem(p => ({ ...p, price: e.target.value }))} />
                <select className="input-field" value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button className="btn btn-primary" onClick={handleAddItem}>+ Add Item</button>
              </div>
              <textarea className="input-field" placeholder="Description..." value={newItem.description} onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))} rows={2} style={{ marginTop: 12, resize: 'vertical' }} />
            </div>

            {/* Items Table */}
            <div className={styles.menuTable}>
              <div className={styles.menuTableHead}>
                <span>Item</span><span>Category</span><span>Price</span><span>Status</span><span>Actions</span>
              </div>
              {menuItems.map(item => {
                const catName = categories.find(c => c.id === item.category_id)?.name || item.category_id;
                return (
                  <div key={item.id} className={`${styles.menuRow} ${!item.available ? styles.menuRowUnavail : ''}`}>
                    <span className={styles.menuItemName}>{item.name}</span>
                    <span className={styles.menuItemCat}>{catName}</span>
                    <span className={styles.menuItemPrice}>₹{item.price}</span>
                    <span>
                      <span className={`tag ${item.available ? 'tag-green' : 'tag-red'}`}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                    </span>
                    <div className={styles.menuActions}>
                      <button className="btn btn-sm btn-ghost" onClick={() => toggleAvailability(item.id)}>
                        {item.available ? 'Disable' : 'Enable'}
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteItem(item.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Tables ── */}
        {tab === 'tables' && (
          <div className={styles.section}>
            <p className="text-muted" style={{ marginBottom: 24 }}>
              All tables with their QR code URLs. Print and place on each table.
            </p>
            <div className={styles.tablesGrid}>
              {tables.map(table => (
                <div key={table.id} className={styles.tableCard}>
                  <div className={styles.tableCardHeader}>
                    <span className={styles.tableNum}>Table {table.number}</span>
                    <span className={`tag ${table.floor === 1 ? 'tag-blue' : 'tag-gold'}`}>
                      Floor {table.floor}
                    </span>
                  </div>
                  <div className={styles.qrBox}>
                    <span style={{ fontSize: 40 }}>📱</span>
                    <span className={styles.qrText}>QR Code</span>
                  </div>
                  <code className={styles.qrUrl}>{table.qr_url || `/menu?table=${table.number}&floor=${table.floor}`}</code>
                  <div className={styles.tableCardActions}>
                    <a
                      href={table.qr_url || `/menu?table=${table.number}&floor=${table.floor}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm btn-full"
                    >
                      Preview URL
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Orders History ── */}
        {tab === 'orders' && (
          <div className={styles.section}>
            {realOrders.length === 0 ? (
              <div className={styles.empty}>
                <span style={{ fontSize: 40 }}>📋</span>
                <p>No orders yet. Place a test order from the menu!</p>
              </div>
            ) : (
              <div className={styles.ordersTable}>
                <div className={styles.ordersHead}>
                  <span>Order ID</span><span>Table</span><span>Items</span><span>Total</span><span>Status</span><span>Time</span>
                </div>
                {realOrders.map(order => (
                  <div key={order.id} className={styles.ordersRow}>
                    <span className={styles.orderId}>{order.id.slice(0, 6)}</span>
                    <span>T{order.tableNumber} F{order.floor}</span>
                    <span>{order.items?.length} item{order.items?.length > 1 ? 's' : ''}</span>
                    <span className="text-gold">₹{order.total}</span>
                    <span>
                      <span className={`tag ${
                        order.status === 'served'    ? 'tag-green' :
                        order.status === 'preparing' ? 'tag-warning' :
                        order.status === 'confirmed' ? 'tag-blue' : 'tag-red'
                      }`}>{order.status}</span>
                    </span>
                    <span className={styles.orderTime}>
                      {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
