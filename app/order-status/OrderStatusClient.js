'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useOrder } from '../../lib/orderContext';
import { ORDER_STATUSES } from '../../lib/mockData';
import styles from './page.module.css';

const STEPS = ['placed', 'confirmed', 'preparing', 'served'];

export default function OrderStatusClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const { getOrder, orders, updateOrderStatus } = useOrder();
  const [order, setOrder] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const found = getOrder(orderId);
      if (found) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOrder(found);
        setLoading(false);
      } else {
        // If not found immediately, give the context a moment to load from the DB
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
      }
    } else {
      setLoading(false);
    }
  }, [orderId, orders, getOrder]);

  // Elapsed time
  useEffect(() => {
    if (!order?.createdAt) return;
    const id = setInterval(() => {
      const diff = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 1000);
      setElapsed(diff);
    }, 1000);
    return () => clearInterval(id);
  }, [order?.createdAt]);

  // Simulate status progression (demo)
  useEffect(() => {
    if (!order || order.status === 'served') return;
    const idx = STEPS.indexOf(order.status);
    if (idx < STEPS.length - 1) {
      const timeout = [8000, 20000, 40000][idx] || 8000;
      const timer = setTimeout(() => {
        const nextStatus = STEPS[idx + 1];
        updateOrderStatus(order.id, nextStatus);
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [order, updateOrderStatus]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles.centeredMain}>
          <div className="spinner" style={{ width: 48, height: 48, borderWidth: 3 }} />
          <h2 className="heading-md" style={{ marginTop: 16 }}>Locating your order...</h2>
        </main>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <main className={styles.centeredMain}>
          <div className={styles.notFound}>
            <span style={{ fontSize: 48 }}>🔍</span>
            <h2 className="heading-lg">Order not found</h2>
            <p className="text-muted">Check your order ID or start over.</p>
            <Link href="/menu" className="btn btn-primary">Back to Menu</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currentStep = STEPS.indexOf(order.status);
  const statusConfig = ORDER_STATUSES[order.status] || ORDER_STATUSES.placed;

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <span className="section-eyebrow">Live Order Tracking</span>
            <h1 className="heading-xl" style={{ marginTop: 12 }}>
              {order.status === 'served' ? '🎉 Order Served!' : 'Order Confirmed!'}
            </h1>
            <p className={styles.orderId}>Order ID: <strong>{order.id}</strong></p>
          </div>

          {/* Status Tracker */}
          <div className={styles.tracker}>
            {STEPS.map((step, i) => {
              const isActive   = i === currentStep;
              const isComplete = i < currentStep;
              const config = ORDER_STATUSES[step];
              return (
                <div key={step} className={styles.trackStep}>
                  <div className={`${styles.stepCircle} ${isComplete ? styles.complete : ''} ${isActive ? styles.active : ''}`}>
                    {isComplete ? '✓' : i + 1}
                  </div>
                  <div className={styles.stepInfo}>
                    <span className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ''}`}>
                      {config.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`${styles.connector} ${i < currentStep ? styles.connectorFilled : ''}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Status Card */}
          <div className={styles.statusCard}>
            <div className={styles.statusMain}>
              <div className={styles.statusIcon}>
                {order.status === 'placed'    ? '📋' :
                 order.status === 'confirmed' ? '✅' :
                 order.status === 'preparing' ? '👨‍🍳' :
                 order.status === 'served'    ? '🎉' : '📋'}
              </div>
              <div>
                <h2 className={styles.statusText}>{statusConfig.label}</h2>
                <p className={styles.statusEta}>
                  {order.status === 'served'
                    ? 'Enjoy your order! 🙏'
                    : `Estimated time: ${statusConfig.eta}`}
                </p>
              </div>
            </div>
            <div className={styles.elapsedBadge}>
              ⏱ {formatTime(elapsed)} ago
            </div>
          </div>

          {/* Order Details */}
          <div className={styles.detailsCard}>
            <div className={styles.detailsHeader}>
              <h3 className="heading-md">Order Details</h3>
              <span className={styles.tableTag}>
                📍 Table {order.tableNumber} · Floor {order.floor || 1}
              </span>
            </div>
            <div className={styles.detailItems}>
              {order.items?.map(item => (
                <div key={item.id} className={styles.detailItem}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} className={styles.detailImage} />
                  ) : (
                    <span className={styles.detailEmoji}>
                      {item.category === 'coffee' ? '☕' :
                       item.category === 'cold'   ? '🧊' :
                       item.category === 'snacks' ? '🥐' :
                       item.category === 'bakery' ? '🧁' : '⭐'}
                    </span>
                  )}
                  <span className={styles.detailName}>{item.name} × {item.quantity}</span>
                  <span className={styles.detailPrice}>₹{item.subtotal}</span>
                </div>
              ))}
            </div>
            <div className={styles.detailTotal}>
              <span>Total Paid</span>
              <span className={styles.totalAmount}>₹{order.total}</span>
            </div>
            {order.specialInstructions && (
              <p className={styles.note}>📝 Note: {order.specialInstructions}</p>
            )}
          </div>

          <div className={styles.actions}>
            <Link href="/menu" className="btn btn-outline">Order More</Link>
            {order.status === 'served' && (
              <Link href="/" className="btn btn-primary">Visit Us Again 🙏</Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
