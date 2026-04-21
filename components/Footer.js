import Link from 'next/link';
import { CAFE_INFO } from '../lib/mockData';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topBar}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoCore}>CORE</span>
            <span className={styles.logoCafe}>cafe</span>
          </div>
          <p className={styles.tagline}>
            Where every sip counts.<br/>
            <em>No waiters. All vibes.</em>
          </p>
        </div>

        <div className={styles.links}>
          <div className={styles.linkGroup}>
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/menu">Menu</Link></li>
              <li><Link href="/order">Cart</Link></li>
              <li><Link href="/login">Login</Link></li>
            </ul>
          </div>
          <div className={styles.linkGroup}>
            <h4>Hours</h4>
            <ul>
              <li>Mon – Fri: {CAFE_INFO.hours.weekdays}</li>
              <li>Sat – Sun: {CAFE_INFO.hours.weekends}</li>
            </ul>
          </div>
          <div className={styles.linkGroup}>
            <h4>Contact</h4>
            <ul>
              <li>
                <a href={`mailto:${CAFE_INFO.email}`}>{CAFE_INFO.email}</a>
              </li>
              <li>
                <a href={`tel:${CAFE_INFO.phone}`}>{CAFE_INFO.phone}</a>
              </li>
              <li className={styles.address}>{CAFE_INFO.address}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} CORE Cafe. All rights reserved. Hinjwadi Phase 3, Pune.</p>
        <div className={styles.socials}>
          <a href={CAFE_INFO.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href={CAFE_INFO.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
