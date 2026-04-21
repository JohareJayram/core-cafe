'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import MenuCard from '../../components/MenuCard';
import ToastContainer, { toast } from '../../components/Toast';
import { useCart } from '../../lib/cartContext';
import { useOrder } from '../../lib/orderContext';
import { supabase } from '../../lib/supabase';
import styles from './page.module.css';

export default function MenuPageClient() {
  const searchParams = useSearchParams();
  const tableNum  = searchParams.get('table');
  const floorNum  = searchParams.get('floor');

  const { itemCount, total, setTable, tableNumber, floor } = useCart();
  const { addCallStaffAlert } = useOrder();

  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [callingStaff, setCallingStaff] = useState(false);

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [{ data: cats }, { data: items }] = await Promise.all([
          supabase.from('categories').select('*').order('sort'),
          supabase.from('menu_items').select('*')
        ]);
        if (cats) setCategories(cats);
        if (items) setMenuItems(items);
      } catch (err) {
        console.error('Error fetching menu:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Auto-set table from URL
  useEffect(() => {
    if (tableNum && !tableNumber) {
      setTable(Number(tableNum), Number(floorNum) || 1);
      toast(`📍 Seated at Table ${tableNum}, Floor ${floorNum || 1}`, 'info');
    }
  }, [tableNum, floorNum, tableNumber, setTable]);

  const filtered = menuItems.filter(item => {
    const matchesCat  = activeCategory === 'all' || item.category_id === activeCategory;
    const matchesText = item.name.toLowerCase().includes(search.toLowerCase()) ||
                        (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesText && item.available;
  });

  const handleCallStaff = () => {
    setCallingStaff(true);
    addCallStaffAlert(tableNumber || tableNum || '?', floor || floorNum || '1');
    toast('✋ Staff has been notified! They\'ll be with you shortly.', 'success');
    setTimeout(() => setCallingStaff(false), 3000);
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <main className={styles.main}>
        <div className={styles.mobileTop}>
          <div className={styles.mobileProfile}>
            <span className={styles.mobileAvatar}>☕</span>
            <span className={styles.mobileLocation}>Hinjwadi</span>
          </div>
          <button type="button" className={styles.mobileBell} aria-label="Notifications">
            🔔
          </button>
        </div>

        {/* Table Badge */}
        {tableNum && (
          <div className={styles.tableBadge}>
            📍 Table {tableNum} · Floor {floorNum || 1}
          </div>
        )}

        {/* Page Header */}
        <div className={styles.header}>
          <span className="section-eyebrow">Fresh & Crafted Daily</span>
          <h1 className="display-lg" style={{ marginTop: 8 }}>Our Menu</h1>
          <p className="text-muted" style={{ marginTop: 8 }}>
            From single-origin espressos to fresh-baked pastries — everything made with care.
          </p>
        </div>

        {/* Search + Category Tabs */}
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="menu-search"
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch('')}>×</button>
            )}
          </div>

          <h2 className={styles.mobileCategoryTitle}>Categories</h2>
          <div className={styles.categories}>
            <button
              className={`${styles.catTab} ${activeCategory === 'all' ? styles.catActive : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`${styles.catTab} ${activeCategory === cat.id ? styles.catActive : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className={styles.empty}>
            <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto', borderWidth: 3 }} />
            <p>Loading fresh menu...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((item, i) => (
              <div key={item.id} className={styles.cardWrap} style={{ animationDelay: `${i * 50}ms` }}>
                <MenuCard item={item} onDetail={() => {}} />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <span style={{ fontSize: 48 }}>🔍</span>
            <p>No items found for &quot;<strong>{search}</strong>&quot;</p>
            <button className="btn btn-outline btn-sm" onClick={() => setSearch('')}>Clear Search</button>
          </div>
        )}
      </main>

      {/* Floating Cart Bar */}
      {itemCount > 0 && (
        <div className={styles.cartBar}>
          <div className={styles.cartBarInfo}>
            <span className={styles.cartBarCount}>{itemCount} item{itemCount > 1 ? 's' : ''}</span>
            <span className={styles.cartBarSep}>·</span>
            <span className={styles.cartBarTotal}>₹{total}</span>
          </div>
          <Link href="/order" className={styles.cartBarBtn}>
            View Cart & Order →
          </Link>
        </div>
      )}

      {/* Call Staff FAB */}
      {tableNum && (
        <button
          className={`${styles.callStaffFab} ${callingStaff ? styles.fabCalling : ''}`}
          onClick={handleCallStaff}
          disabled={callingStaff}
          aria-label="Call staff to your table"
          title="Call Staff"
        >
          {callingStaff ? '✓' : '🛎️'}
        </button>
      )}

      <Footer />
    </>
  );
}
