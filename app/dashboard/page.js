'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOrder } from '../../lib/orderContext';
import { ORDER_STATUSES } from '../../lib/mockData';
import ToastContainer, { toast } from '../../components/Toast';
import styles from './page.module.css';

const STATUS_ACTIONS = {
  placed:    { next: 'confirmed',  label: 'Confirm Order',  cls: 'btn-primary' },
  confirmed: { next: 'preparing',  label: 'Start Preparing', cls: 'btn-primary' },
  preparing: { next: 'served',     label: 'Mark as Served', cls: 'btn-primary' },
  served:    { next: null,         label: 'Completed ✓',    cls: 'btn-ghost' },
};

export default function DashboardPage() {
  const router = useRouter();
  const { orders, activeOrders, callStaffAlerts, updateOrderStatus, resolveCallStaff } = useOrder();
  const [view, setView] = useState('active'); // 'active' | 'all'
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const prevCountRef = useRef(0);

  useEffect(() => {
    const stored = localStorage.getItem('core_cafe_user');
    if (!stored) {
      router.replace('/login');
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(stored);
    } catch {
      router.replace('/login');
      return;
    }
    if (!['staff', 'manager'].includes(parsed.role)) {
      router.replace('/login');
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(parsed);
    setAuthChecked(true);
  }, [router]);

  // Sound alert on new orders
  useEffect(() => {
    const realOrders = orders.filter(o => o.type !== 'call_staff');
    if (realOrders.length > prevCountRef.current && prevCountRef.current > 0) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
      } catch (e) {}
      toast('🍽️ New order received!', 'info');
    }
    prevCountRef.current = realOrders.length;
  }, [orders]);

  const displayOrders = view === 'active'
    ? orders.filter(o => o.type !== 'call_staff' && !['served', 'cancelled'].includes(o.status))
    : orders.filter(o => o.type !== 'call_staff');

  if (!authChecked) return null;

  const handleStatusUpdate = (orderId, nextStatus) => {
    if (!nextStatus) return;
    updateOrderStatus(orderId, nextStatus);
    toast(`Order updated → ${ORDER_STATUSES[nextStatus]?.label}`, 'success');
  };

  const timeAgo = (iso) => {
    // eslint-disable-next-line react-hooks/purity
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    return `${Math.floor(diff/3600)}h ago`;
  };

  return (
    <div className={styles.page}>
      <ToastContainer />

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoCore}>CORE</span>
          <span className={styles.logoCafe}>cafe</span>
        </div>

        <nav className={styles.sideNav}>
          <Link href="/dashboard" className={`${styles.navItem} ${styles.navActive}`}>
            <span>🍽️</span> Orders
          </Link>
          {user?.role === 'manager' && (
            <Link href="/admin" className={styles.navItem}>
              <span>📊</span> Admin
            </Link>
          )}
          <Link href="/menu" className={styles.navItem}>
            <span>☕</span> Menu
          </Link>
        </nav>

        <div className={styles.sidebarUser}>
          <div className={styles.userAvatar}>{user?.name?.[0] || 'S'}</div>
          <div>
            <div className={styles.userName}>{user?.name || 'Staff'}</div>
            <div className={styles.userRole}>{user?.role || 'staff'}</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>Kitchen Dashboard</h1>
            <p className={styles.pageSubtitle}>Live incoming orders</p>
          </div>
          <div className={styles.topBarRight}>
            {/* Call Staff Alerts */}
            {callStaffAlerts.filter(a => !a.resolved).length > 0 && (
              <div className={styles.callAlerts}>
                {callStaffAlerts.filter(a => !a.resolved).map(alert => (
                  <div key={alert.id} className={styles.callAlert}>
                    <span>🛎️ Table {alert.tableNumber} (Floor {alert.floor}) needs staff</span>
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => resolveCallStaff(alert.id)}
                    >
                      Resolve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          {[
            { label: 'Active Orders', value: activeOrders.length, icon: '🔥' },
            { label: 'Served Today',  value: orders.filter(o => o.status === 'served').length, icon: '✅' },
            { label: 'Awaiting',      value: orders.filter(o => o.status === 'placed').length, icon: '⏳' },
            { label: 'Staff Calls',   value: callStaffAlerts.filter(a => !a.resolved).length,  icon: '🛎️' },
          ].map(s => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* View Toggle */}
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${view === 'active' ? styles.viewBtnActive : ''}`}
            onClick={() => setView('active')}
          >Active Orders</button>
          <button
            className={`${styles.viewBtn} ${view === 'all' ? styles.viewBtnActive : ''}`}
            onClick={() => setView('all')}
          >All Orders</button>
        </div>

        {/* Order Cards */}
        {displayOrders.length === 0 ? (
          <div className={styles.empty}>
            <span style={{ fontSize: 48 }}>😌</span>
            <p>No {view === 'active' ? 'active' : ''} orders right now</p>
          </div>
        ) : (
          <div className={styles.ordersGrid}>
            {displayOrders.map(order => {
              const action = STATUS_ACTIONS[order.status];
              return (
                <div key={order.id} className={`${styles.orderCard} ${styles[`status_${order.status}`]}`}>
                  <div className={styles.orderCardTop}>
                    <div className={styles.tableChip}>
                      📍 Table {order.tableNumber} · F{order.floor}
                    </div>
                    <div className={styles.orderTime}>{timeAgo(order.createdAt)}</div>
                  </div>

                  <div className={styles.orderStatus}>
                    <span className={`status-dot ${order.status}`} />
                    <span>{ORDER_STATUSES[order.status]?.label}</span>
                  </div>

                  <div className={styles.orderItems}>
                    {order.items?.map(i => (
                      <div key={i.id} className={styles.orderItem}>
                        <span>{i.name} × {i.quantity}</span>
                        <span>₹{i.subtotal}</span>
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <div className={styles.orderNote}>
                      📝 {order.specialInstructions}
                    </div>
                  )}

                  <div className={styles.orderFooter}>
                    <span className={styles.orderTotal}>₹{order.total}</span>
                    {action?.next && (
                      <button
                        className={`btn btn-sm ${action.cls} ${styles.actionBtn}`}
                        onClick={() => handleStatusUpdate(order.id, action.next)}
                      >
                        {action.label}
                      </button>
                    )}
                    {!action?.next && <span className={styles.completedBadge}>✓ Done</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
