'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { TESTIMONIALS, CAFE_INFO } from '../lib/mockData';
import { supabase } from '../lib/supabase';
import MenuCard from '../components/MenuCard';
import ToastContainer, { toast } from '../components/Toast';
import WelcomeModal from '../components/WelcomeModal';
import styles from './page.module.css';

export default function LandingClient() {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [showWelcome, setShowWelcome] = useState(false);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setVisibleSections(prev => new Set([...prev, e.target.id]));
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(`.${styles.animateSection}`).forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const { data } = await supabase
          .from('menu_items')
          .select('*')
          .eq('available', true);
          
        if (data && data.length > 0) {
          // Fallback to top 6 if tags don't perfectly match 'bestseller'
          const best = data.filter(i => i.tags && i.tags.includes('bestseller'));
          setFeaturedItems(best.length > 0 ? best.slice(0, 6) : data.slice(0, 6));
        }
      } catch (err) {
        console.error('Error fetching featured items:', err);
      } finally {
        setLoadingFeatured(false);
      }
    }
    loadFeatured();
  }, []);

  useEffect(() => {
    const isLogged = localStorage.getItem('core_cafe_user');
    const isGuest = localStorage.getItem('core_cafe_guest');

    if (!isLogged && !isGuest) {
      // Show modal after a small delay for a cleaner entrance
      const timer = setTimeout(() => setShowWelcome(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const isVisible = (id) => visibleSections.has(id);

  return (
    <main className={styles.main}>
      <ToastContainer />
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroGradient} />
          {/* Floating orbs for visual depth */}
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.orb3} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span className={styles.dot} />
            Hinjwadi&apos;s First Waiterless Cafe
          </div>
          <h1 className={`display-xl ${styles.heroTitle}`}>
            Order Your Way.
            <br />
            <span className="gold-gradient">No Waiting.</span>
          </h1>
          <p className={styles.heroSubline}>
            Scan the QR on your table. Browse our premium menu.
            <br className="hide-mobile" />
            Your order reaches the kitchen instantly — no waiter, no wait.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/menu" className="btn btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/>
              </svg>
              Browse Menu
            </Link>
            <a href="#how-it-works" className="btn btn-outline btn-lg">
              How It Works
            </a>
          </div>

          {/* Stats */}
          <div className={styles.heroStats}>
            {[
              { value: '16', label: 'Tables' },
              { value: '2', label: 'Floors' },
              { value: '< 90s', label: 'Order Time' },
              { value: '19+', label: 'Menu Items' },
            ].map(s => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className={styles.scrollHint}>
          <div className={styles.scrollLine} />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        className={`${styles.animateSection} ${styles.howSection} ${isVisible('how-it-works') ? styles.sectionVisible : ''}`}
      >
        <div className="section">
          <div className="section-header">
            <span className="section-eyebrow">The CORE Experience</span>
            <h2 className="heading-xl" style={{ marginTop: 12 }}>
              Three steps to your perfect cup
            </h2>
          </div>
          <div className={styles.steps}>
            {[
              {
                step: '01',
                icon: '📱',
                title: 'Scan Your Table QR',
                desc: 'Every table has a unique QR code. Scan it with your phone — no app needed.',
              },
              {
                step: '02',
                icon: '☕',
                title: 'Pick Your Order',
                desc: 'Browse our full menu with photos and descriptions. Add items to your cart in seconds.',
              },
              {
                step: '03',
                icon: '✨',
                title: 'Sit Back & Enjoy',
                desc: 'Your order goes straight to the kitchen. We bring it to your table. That\'s it.',
              },
            ].map((s, i) => (
              <div
                key={s.step}
                className={styles.stepCard}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className={styles.stepNumber}>{s.step}</div>
                <div className={styles.stepIcon}>{s.icon}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
                {i < 2 && <div className={styles.stepArrow}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED MENU ── */}
      <section
        id="featured"
        className={`${styles.animateSection} ${styles.featuredSection} ${isVisible('featured') ? styles.sectionVisible : ''}`}
      >
        <div className="section">
          <div className="section-header">
            <span className="section-eyebrow">What We Serve</span>
            <h2 className="heading-xl" style={{ marginTop: 12 }}>
              Customer Favourites
            </h2>
            <p className="text-muted text-lg" style={{ marginTop: 8 }}>
              From signature espressos to fresh-baked pastries — crafted with care, every time.
            </p>
          </div>

          <div className={styles.menuGrid}>
            {loadingFeatured ? (
              <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px 0' }}>
                <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto', borderWidth: 2 }} />
                <p style={{ marginTop: 16 }}>Loading our bestsellers...</p>
              </div>
            ) : featuredItems.length > 0 ? (
              featuredItems.map((item, i) => (
                <div key={item.id} style={{ animationDelay: `${i * 80}ms` }}>
                  <MenuCard item={item} />
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px 0' }}>
                <p>No featured items available right now.</p>
              </div>
            )}
          </div>

          <div className={styles.menuCta}>
            <Link href="/menu" className="btn btn-primary btn-lg">
              View Full Menu →
            </Link>
          </div>
        </div>
      </section>

      {/* ── VALUE PROPS ── */}
      <section
        id="values"
        className={`${styles.animateSection} ${styles.valuesSection} ${isVisible('values') ? styles.sectionVisible : ''}`}
      >
        <div className={styles.valuesBg} />
        <div className="section">
          <div className={styles.valuesGrid}>
            {[
              {
                icon: '🏆',
                title: 'Premium Beans',
                desc: 'Sourced from single-origin farms. Roasted locally in Pune every week.',
              },
              {
                icon: '⚡',
                title: 'Zero Wait Time',
                desc: 'Order directly from your phone. No flagging down waiters. No confusion.',
              },
              {
                icon: '💳',
                title: 'Seamless Payment',
                desc: 'Pay via UPI, card, or net banking — all through Razorpay. Safe & instant.',
              },
              {
                icon: '🌿',
                title: 'Fresh Daily',
                desc: 'Bakery items baked every morning. Cold brews steeped overnight. Always fresh.',
              },
            ].map((v, i) => (
              <div key={v.title} className={styles.valueCard} style={{ animationDelay: `${i * 100}ms` }}>
                <div className={styles.valueIcon}>{v.icon}</div>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AMBIENCE GALLERY ── */}
      <section
        id="gallery"
        className={`${styles.animateSection} ${styles.gallerySection} ${isVisible('gallery') ? styles.sectionVisible : ''}`}
      >
        <div className="section">
          <div className="section-header">
            <span className="section-eyebrow">The Space</span>
            <h2 className="heading-xl" style={{ marginTop: 12 }}>
              Come for the coffee,<br />
              <span className="gold-gradient">stay for the vibe</span>
            </h2>
          </div>
          <div className={styles.galleryGrid}>
            {[
              { emoji: '🏡', label: 'Ground Floor Lounge', image: '/images/menu/gallery1.png' },
              { emoji: '☕', label: 'The Brew Bar' },
              { emoji: '🌅', label: 'Second Floor Terrace' },
              { emoji: '📚', label: 'Work Corner' },
            ].map((g, i) => (
              <div key={g.label} className={`${styles.galleryItem} ${i === 0 ? styles.galleryLarge : ''}`}>
                {g.image ? (
                  <>
                    <img src={g.image} alt={g.label} className={styles.galleryImg} />
                    <div className={styles.galleryImgOverlay}>
                      <span className={styles.galleryLabelText}>{g.label}</span>
                    </div>
                  </>
                ) : (
                  <div className={styles.galleryPlaceholder}>
                    <span className={styles.galleryEmoji}>{g.emoji}</span>
                    <span className={styles.galleryLabel}>{g.label}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        id="testimonials"
        className={`${styles.animateSection} ${styles.testimonialsSection} ${isVisible('testimonials') ? styles.sectionVisible : ''}`}
      >
        <div className="section">
          <div className="section-header">
            <span className="section-eyebrow">Happy Customers</span>
            <h2 className="heading-xl" style={{ marginTop: 12 }}>
              What people are saying
            </h2>
          </div>
          <div className={styles.testimonialGrid}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.id} className={styles.testimonialCard} style={{ animationDelay: `${i * 120}ms` }}>
                <div className={styles.stars}>{'★'.repeat(t.rating)}</div>
                <p className={styles.testimonialText}>&quot;{t.text}&quot;</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.avatar}>{t.initials}</div>
                  <div>
                    <div className={styles.authorName}>{t.name}</div>
                    <div className={styles.authorRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerContent}>
          <h2 className="heading-xl">
            Ready to order?
          </h2>
          <p className="text-lg text-muted">
            Walk in, scan the QR on your table, and place your order in under 90 seconds.
          </p>
          <div className={styles.ctaBannerBtns}>
            <Link href="/menu" className="btn btn-primary btn-lg">
              View Menu →
            </Link>
            <Link href="/login" className="btn btn-ghost btn-lg">
              Create Account
            </Link>
          </div>
          <p className={styles.address}>
            📍 {CAFE_INFO.address}
          </p>
        </div>
      </section>
    </main>
  );
}
