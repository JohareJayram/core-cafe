'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../lib/cartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { itemCount } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    // Check user session
    const checkUser = () => {
      const stored = localStorage.getItem('core_cafe_user');
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch (e) { setUser(null); }
      } else {
        setUser(null);
      }
    };
    checkUser();
    // Listening for manual login events from other tabs or same window
    window.addEventListener('storage', checkUser);
    
    // Custom event for same-tab login updates without reload
    window.addEventListener('core_login_update', checkUser);
    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('core_login_update', checkUser);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false); 
  }, [pathname]);

  const navLinks = [
    { href: '/',       label: 'Home' },
    { href: '/menu',   label: 'Menu' },
  ];
  
  if (user?.role === 'manager' || user?.role === 'staff') {
    navLinks.push({ href: user.role === 'manager' ? '/admin' : '/dashboard', label: 'Dashboard' });
  }

  const handleLogout = () => {
    localStorage.removeItem('core_cafe_user');
    setUser(null);
    window.dispatchEvent(new Event('core_login_update'));
  };

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoCore}>CORE</span>
            <span className={styles.logoCafe}>cafe</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className={styles.navLinks}>
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className={styles.actions}>
            {/* Cart */}
            <Link href="/order" className={styles.cartBtn} aria-label="View cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {itemCount > 0 && (
                <span className={styles.cartBadge}>{itemCount}</span>
              )}
            </Link>

            {/* Login / User Session */}
            {user ? (
              <div className={styles.userMenu}>
                <span className={styles.greeting}>Hi, {user.name?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ padding: '0.4rem 0.6rem' }}>
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
            )}

            {/* Hamburger */}
            <button
              className={styles.hamburger}
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <span className={mobileOpen ? styles.lineOpen : ''}></span>
              <span className={mobileOpen ? styles.lineHide : ''}></span>
              <span className={mobileOpen ? styles.lineOpen2 : ''}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)} />
          <div className={styles.mobilePanel}>
            <div className={styles.mobileLogo}>
              <span className={styles.logoCore}>CORE</span>
              <span className={styles.logoCafe}>cafe</span>
            </div>
            <ul className={styles.mobileLinks}>
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`${styles.mobileLink} ${pathname === link.href ? styles.active : ''}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/order" className={styles.mobileLink}>
                  Cart {itemCount > 0 && `(${itemCount})`}
                </Link>
              </li>
            </ul>
            <div className={styles.mobileActions}>
              {user ? (
                <>
                  <div style={{ marginBottom: 16, color: 'var(--text-primary)' }}>
                    Hi, {user.name}
                  </div>
                  <button onClick={handleLogout} className="btn btn-outline btn-full">
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="btn btn-primary btn-full">
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
