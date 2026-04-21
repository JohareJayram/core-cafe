'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ToastContainer, { toast } from '../../components/Toast';
import { useCart } from '../../lib/cartContext';
import styles from './page.module.css';

export default function OrderPage() {
  const router = useRouter();
  const {
    items, total, itemCount,
    updateQty, removeItem,
    tableNumber, floor, setTable,
    specialInstructions, setInstructions,
  } = useCart();

  const [guestName,  setGuestName]  = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [tableInput, setTableInput] = useState(tableNumber || '');
  const [floorInput, setFloorInput] = useState(floor || 1);
  const handleProceed = () => {
    const parsedTable = Number(tableInput);
    const parsedFloor = Number(floorInput);
    if (!tableInput) { toast('Please enter your table number', 'error'); return; }
    if (!Number.isInteger(parsedTable) || parsedTable < 1 || parsedTable > 16) {
      toast('Table number must be between 1 and 16', 'error');
      return;
    }
    if (parsedFloor === 1 && parsedTable > 10) {
      toast('Floor 1 only supports tables 1-10', 'error');
      return;
    }
    if (parsedFloor === 2 && parsedTable < 11) {
      toast('Floor 2 only supports tables 11-16', 'error');
      return;
    }
    if (items.length === 0) { toast('Your cart is empty', 'error'); return; }
    setTable(parsedTable, parsedFloor);
    try {
      sessionStorage.setItem(
        'core_cafe_checkout_meta',
        JSON.stringify({
          guestName: guestName.trim(),
          guestPhone: guestPhone.trim(),
        })
      );
    } catch {}
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className={styles.emptyMain}>
          <div className={styles.emptyState}>
            <span style={{ fontSize: 64 }}>🛒</span>
            <h2 className="heading-lg">Your cart is empty</h2>
            <p className="text-muted">Head to the menu and add some items!</p>
            <Link href="/menu" className="btn btn-primary btn-lg">Browse Menu →</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ToastContainer />
      <main className={styles.main}>
        <div className={styles.inner}>
          {/* Left: Cart Items */}
          <div className={styles.left}>
            <h1 className="heading-xl">Your Order</h1>
            <p className="text-muted" style={{ marginTop: 4 }}>
              Review your items before placing the order
            </p>

            <div className={styles.cartItems}>
              {items.map(item => (
                <div key={item.id} className={styles.cartItem}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                  ) : (
                    <div className={styles.itemEmoji}>
                      {item.category === 'coffee' ? '☕' :
                       item.category === 'cold'   ? '🧊' :
                       item.category === 'snacks' ? '🥐' :
                       item.category === 'bakery' ? '🧁' : '⭐'}
                    </div>
                  )}
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemPrice}>₹{item.price} each</span>
                  </div>
                  <div className={styles.qtyControls}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                    >−</button>
                    <span className={styles.qtyNum}>{item.quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                    >+</button>
                  </div>
                  <span className={styles.lineTotal}>₹{item.price * item.quantity}</span>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >×</button>
                </div>
              ))}
            </div>

            {/* Special Instructions */}
            <div className={styles.instructions}>
              <label className="input-label" htmlFor="special-instructions">
                Special Instructions (optional)
              </label>
              <textarea
                id="special-instructions"
                className={`input-field ${styles.textarea}`}
                placeholder="Allergies, preferences, extra sugar... anything!"
                value={specialInstructions}
                onChange={e => setInstructions(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className={styles.right}>
            <div className={styles.summaryCard}>
              <h2 className="heading-md">Order Summary</h2>

              {/* Table Number */}
              <div className={styles.tableSection}>
                <div className={styles.inputGroup}>
                  <label className="input-label" htmlFor="table-number">Table Number</label>
                  <input
                    id="table-number"
                    className="input-field"
                    type="number"
                    min={1}
                    max={16}
                    inputMode="numeric"
                    placeholder="e.g. 5"
                    value={tableInput}
                    onChange={e => setTableInput(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className="input-label" htmlFor="floor-select">Floor</label>
                  <select
                    id="floor-select"
                    className="input-field"
                    value={floorInput}
                    onChange={e => setFloorInput(e.target.value)}
                  >
                    <option value={1}>Floor 1 (Tables 1–10)</option>
                    <option value={2}>Floor 2 (Tables 11–16)</option>
                  </select>
                </div>
              </div>

              {/* Guest Info */}
              <div className={styles.guestSection}>
                <p className={styles.guestLabel}>Your Details <span>(optional — for order history)</span></p>
                <input
                  className={`input-field ${styles.guestInput}`}
                  type="text"
                  placeholder="Your name"
                    autoComplete="name"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  id="guest-name"
                />
                <input
                  className={`input-field ${styles.guestInput}`}
                  type="tel"
                  placeholder="Phone number"
                    autoComplete="tel"
                    inputMode="tel"
                  value={guestPhone}
                  onChange={e => setGuestPhone(e.target.value)}
                  id="guest-phone"
                />
              </div>

              {/* Totals */}
              <div className={styles.totals}>
                <div className={styles.totalRow}>
                  <span>Subtotal ({itemCount} items)</span>
                  <span>₹{total}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Platform Fee</span>
                  <span className="text-gold">Free</span>
                </div>
                <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                className={`btn btn-primary btn-full btn-lg ${styles.placeBtn}`}
                onClick={handleProceed}
                disabled={!tableInput}
                id="proceed-to-payment"
              >
                Proceed to Payment →
              </button>

              <p className={styles.disclaimer}>
                🔒 Secure payment via Razorpay · UPI, Card, NetBanking accepted
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
