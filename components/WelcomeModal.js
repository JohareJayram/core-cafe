'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEMO_ACCOUNTS } from '../lib/mockData';
import { supabase } from '../lib/supabase';
import { toast } from './Toast';
import styles from './WelcomeModal.module.css';

export default function WelcomeModal({ onClose }) {
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
          window.dispatchEvent(new Event('core_login_update'));
          toast('Welcome back, Manager! 👑', 'success');
          onClose();
          router.push('/admin');
        } else if (isStaff) {
          localStorage.setItem('core_cafe_user', JSON.stringify({ ...DEMO_ACCOUNTS.staff }));
          window.dispatchEvent(new Event('core_login_update'));
          toast('Welcome! Orders dashboard loading... 🍽️', 'success');
          onClose();
          router.push('/dashboard');
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
        window.dispatchEvent(new Event('core_login_update'));
        toast(`Welcome, ${user.name}! 👋`, 'success');
        onClose();
      } catch (err) {
        console.error(err);
        toast('Login failed. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGuest = () => {
    localStorage.setItem('core_cafe_guest', 'true');
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={handleGuest} aria-label="Close modal">&times;</button>
        <div className={styles.header}>
          <h2 className="heading-md">Welcome to CORE Cafe</h2>
          <p className="text-muted text-sm" style={{marginTop: '4px'}}>
            Please sign in to order or continue as guest.
          </p>
        </div>

        <div className={styles.form}>
          {step === 1 && (
            <div className="input-group">
              <label className="input-label" htmlFor="modal-identifier">Email or Phone Number</label>
              <input
                id="modal-identifier"
                className="input-field"
                type="text"
                placeholder="e.g. +91 XXXXX XXXXX"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="input-group">
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
            style={{ marginTop: '16px' }}
          >
            {loading ? <><div className="spinner" /> Processing...</> : (step === 1 ? 'Next →' : 'Sign In →')}
          </button>

          {step === 1 && (
            <>
              <div style={{ textAlign: 'center', margin: '16px 0', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '14px' }}>or</span>
              </div>

              <button onClick={handleGuest} className="btn btn-ghost btn-full">
                Continue as Guest
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
