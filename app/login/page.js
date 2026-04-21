'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ToastContainer, { toast } from '../../components/Toast';
import { DEMO_ACCOUNTS } from '../../lib/mockData';
import { supabase } from '../../lib/supabase';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // If identifier contains '@', it's treated as a staff login attempt
  const isStaffFlow = identifier.includes('@');

  const handleNext = () => {
    if (!identifier.trim()) { toast('Please enter email or phone number', 'error'); return; }
    setStep(2);
  };

  const handleLogin = async () => {
    if (step === 1) {
      handleNext();
      return;
    }

    if (isStaffFlow) {
      if (!password) { toast('Please enter your password', 'error'); return; }
      setLoading(true);
      setTimeout(() => {
        const isManager = identifier === DEMO_ACCOUNTS.manager.email && password === DEMO_ACCOUNTS.manager.password;
        const isStaff   = identifier === DEMO_ACCOUNTS.staff.email   && password === DEMO_ACCOUNTS.staff.password;

        if (isManager) {
          localStorage.setItem('core_cafe_user', JSON.stringify({ ...DEMO_ACCOUNTS.manager }));
          toast('Welcome back, Manager! 👑', 'success');
          setTimeout(() => router.push('/admin'), 800);
        } else if (isStaff) {
          localStorage.setItem('core_cafe_user', JSON.stringify({ ...DEMO_ACCOUNTS.staff }));
          toast('Welcome! Orders dashboard loading... 🍽️', 'success');
          setTimeout(() => router.push('/dashboard'), 800);
        } else {
          toast('Invalid credentials. Try again.', 'error');
          setLoading(false);
        }
      }, 1000);
    } else {
      if (!name.trim()) { toast('Please enter your name', 'error'); return; }
      setLoading(true);
      
      try {
        let { data: user, error: fetchErr } = await supabase
          .from('users')
          .select('*')
          .eq('phone', identifier)
          .single();
        
        if (!user) {
          // Create new user
          const { data: newUser, error: insertErr } = await supabase
            .from('users')
            .insert({ phone: identifier, name: name, role: 'customer' })
            .select()
            .single();
            
          if (insertErr) throw insertErr;
          user = newUser;
        }

        localStorage.setItem('core_cafe_user', JSON.stringify(user));
        toast(`Welcome, ${user.name}! 👋`, 'success');
        setTimeout(() => router.push('/menu'), 800);
      } catch (err) {
        console.error(err);
        toast('Login failed. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.page}>
      <ToastContainer />

      {/* Image Side (Desktop Only) */}
      <div className={styles.imageSide}>
        <div className={styles.imageOverlay}>
          <div className={styles.logo}>
            <span className={styles.logoCore}>CORE</span>
            <span className={styles.logoCafe}>cafe</span>
          </div>
          <h2 className={`display-lg ${styles.imageTagline}`}>
            Where every<br/>sip counts.
          </h2>
        </div>
      </div>

      {/* Form Side */}
      <div className={styles.formSide}>
        <div className={styles.card}>
          {/* Logo (Mobile Only) */}
          <Link href="/" className={`${styles.logo} ${styles.mobileLogo}`}>
            <span className={styles.logoCore}>CORE</span>
            <span className={styles.logoCafe}>cafe</span>
          </Link>

        {/* Unified Login Form */}
        <div className={styles.form}>
          <div className={styles.formHeader}>
            <h1 className="heading-md">Welcome to CORE Cafe</h1>
            <p className="text-muted text-sm">
              Enter your email for staff access or phone number to order.
            </p>
          </div>

          <div className={styles.demoHint}>
            <strong>Demo Email:</strong>
            <span>manager@corecafe.in / core2024</span>
          </div>

          {step === 1 && (
            <div className="input-group" style={{ animation: 'fadeIn 0.3s ease' }}>
              <label className="input-label" htmlFor="identifier">Email or Phone Number</label>
              <input
                id="identifier"
                className="input-field"
                type="text"
                placeholder="e.g. your@corecafe.in or +91 XXXXX XXXXX"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="input-group" style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                <label className="input-label" style={{ marginBottom: 0 }}>
                  {isStaffFlow ? 'Password' : 'Your Name'}
                </label>
                <button 
                  onClick={() => setStep(1)} 
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
                  tabIndex={-1}
                >
                  Change {isStaffFlow ? 'Email' : 'Phone'}
                </button>
              </div>
              <input
                id="secondary-input"
                className="input-field"
                type={isStaffFlow ? 'password' : 'text'}
                placeholder={isStaffFlow ? '••••••••' : 'e.g. Priya Mehta'}
                value={isStaffFlow ? password : name}
                onChange={e => isStaffFlow ? setPassword(e.target.value) : setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                autoFocus
              />
            </div>
          )}

          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={step === 1 ? handleNext : handleLogin}
            disabled={loading}
            id="unified-login-btn"
            style={{ marginTop: '8px' }}
          >
            {loading ? <><div className="spinner" /> Processing...</> : (step === 1 ? 'Next →' : 'Sign In →')}
          </button>

          {step === 1 && (
            <>
              <div className={styles.divider}>
                <span>or</span>
              </div>

              <Link href="/menu" className="btn btn-ghost btn-full">
                Continue as Guest (No Login)
              </Link>

              <p className={styles.disclaimer}>
                By continuing, you agree to receive your order updates. No spam, ever.
              </p>
            </>
          )}
        </div>
      </div>
     </div>
    </div>
  );
}
