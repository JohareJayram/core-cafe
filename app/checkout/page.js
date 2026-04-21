'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ToastContainer, { toast } from '../../components/Toast';
import { useCart } from '../../lib/cartContext';
import { useOrder } from '../../lib/orderContext';
import styles from './page.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, tableNumber, floor, specialInstructions, clearCart } = useCart();
  const { placeOrder } = useOrder();

  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePayment = async () => {
    if (items.length === 0) { toast('Cart is empty', 'error'); return; }
    if (!tableNumber) {
      toast('Please choose your table before paying', 'error');
      router.push('/order');
      return;
    }

    setPaying(true);

    // Simulate Razorpay flow (replace with real Razorpay SDK when keys are ready)
    await new Promise(r => setTimeout(r, 2000));

    const order = await placeOrder({
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity,
        category: i.category,
        image: i.image,
      })),
      tableNumber,
      floor,
      specialInstructions,
      total,
      guestName: (() => {
        try {
          const checkoutMeta = JSON.parse(sessionStorage.getItem('core_cafe_checkout_meta') || '{}');
          return checkoutMeta.guestName || '';
        } catch {
          return '';
        }
      })(),
      paymentMethod: 'razorpay_mock',
    });

    setPaid(true);
    setPaying(false);
    clearCart();
    try {
      sessionStorage.removeItem('core_cafe_checkout_meta');
    } catch {}

    setTimeout(() => {
      router.push(`/order-status?id=${order.id}`);
    }, 1200);
  };

  // Redirect if cart empty
  if (items.length === 0 && !paid) {
    return (
      <>
        <Navbar />
        <main className={styles.centeredMain}>
          <div className={styles.empty}>
            <span style={{ fontSize: 48 }}>🛒</span>
            <h2>Nothing to check out</h2>
            <Link href="/menu" className="btn btn-primary">Browse Menu</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ToastContainer />
      <main className={styles.main}>
        <div className={styles.inner}>

          {/* Order Review */}
          <div className={styles.review}>
            <div className={styles.sectionHead}>
              <span className={styles.stepNum}>1</span>
              <h2 className="heading-md">Order Review</h2>
            </div>
            <div className={styles.reviewItems}>
              {items.map(item => (
                <div key={item.id} className={styles.reviewItem}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} className={styles.reviewImage} />
                  ) : (
                    <div className={styles.reviewEmoji}>
                      {item.category === 'coffee' ? '☕' :
                       item.category === 'cold'   ? '🧊' :
                       item.category === 'snacks' ? '🥐' :
                       item.category === 'bakery' ? '🧁' : '⭐'}
                    </div>
                  )}
                  <span className={styles.reviewName}>{item.name} × {item.quantity}</span>
                  <span className={styles.reviewPrice}>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {tableNumber && (
              <div className={styles.tableInfo}>
                📍 Table {tableNumber} · Floor {floor || 1}
                {specialInstructions && (
                  <p className={styles.specialNote}>Note: {specialInstructions}</p>
                )}
              </div>
            )}
          </div>

          {/* Payment */}
          <div className={styles.paymentSection}>
            <div className={styles.sectionHead}>
              <span className={styles.stepNum}>2</span>
              <h2 className="heading-md">Payment</h2>
            </div>

            {/* Razorpay Placeholder */}
            <div className={styles.razorpayBox}>
              <div className={styles.rpHeader}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <span>Secure Payment via Razorpay</span>
              </div>
              <p className={styles.rpNote}>
                Supports UPI, Credit/Debit Card, Net Banking, and Wallets.
                <br />
                <em>(Connect your Razorpay account to enable live payments)</em>
              </p>
              <div className={styles.paymentMethods}>
                {['UPI', 'Card', 'NetBanking', 'Wallets'].map(m => (
                  <span key={m} className={styles.methodTag}>{m}</span>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className={styles.totalBox}>
              <div className={styles.totalRow}>
                <span>Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                <span>₹{total}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Platform Fee</span>
                <span className="text-gold">Free</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total Payable</span>
                <span className={styles.totalAmount}>₹{total}</span>
              </div>
            </div>

            <button
              className={`btn btn-primary btn-full btn-lg ${styles.payBtn}`}
              onClick={handlePayment}
              disabled={paying || paid}
              id="pay-now-btn"
            >
              {paid ? (
                '✓ Payment Successful! Redirecting...'
              ) : paying ? (
                <><div className="spinner" /> Processing Payment...</>
              ) : (
                `Pay ₹${total} Now`
              )}
            </button>

            <div className={styles.secureNote}>
              🔒 256-bit encrypted · PCI DSS compliant
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
