'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '@/lib/redux-store';
import { cacheStorage } from '@/lib/cache-storage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If user already logged in, send to dashboard instead of showing form
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedUserRaw = localStorage.getItem('user');
    if (!savedUserRaw) return;

    try {
      const savedUser = JSON.parse(savedUserRaw);
      if (savedUser?.role === 'patient') {
        router.replace('/dashboard/patient');
      } else if (savedUser?.role === 'doctor') {
        router.replace('/dashboard/doctor');
      } else if (savedUser?.role === 'admin') {
        router.replace('/dashboard/admin');
      }
    } catch {
      // ignore parse errors and stay on login
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Demo login - in production, call your backend API
      const mockUser = {
        id: '123',
        email,
        fullName: email.split('@')[0],
        role: 'patient',
      };

      const mockToken = 'demo-jwt-token-' + Date.now();

      // Save to Redux
      dispatch(setUser(mockUser));
      dispatch(setToken(mockToken));

      // Save to localStorage cache
      cacheStorage.setUser(mockUser);
      cacheStorage.setToken(mockToken);

      // Also store in plain localStorage for auth hook / API
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(335, 60%, 92%) 100%)',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundAttachment: 'fixed',
    }}>
      

      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: `hsl(var(--card))`,
        borderRadius: '20px',
        border: `1.5px solid hsl(var(--border))`,
        boxShadow: 'var(--shadow-lg)',
        backdropFilter: 'blur(10px)',
        padding: '56px 40px',
        animation: 'scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{ marginBottom: '36px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 16px',
            background: `hsl(var(--muted))`,
            borderRadius: '24px',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.5px',
            color: `hsl(var(--primary))`,
            marginBottom: '20px',
            border: `1px solid hsl(var(--border))`,
            textTransform: 'uppercase',
          }}>
             Next-Gen Diagnostic Intelligence
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            marginBottom: '8px',
            letterSpacing: '-0.03em',
            background: `linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--primary)) 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Sign In
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email" style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '700',
              marginBottom: '8px',
              color: `hsl(var(--card-foreground))`,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '10px',
                border: `1.5px solid hsl(var(--border))`,
                background: `hsl(var(--input))`,
                color: `hsl(var(--card-foreground))`,
                fontSize: '14px',
                fontWeight: '500',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = `hsl(var(--primary))`;
                e.currentTarget.style.boxShadow = `0 0 0 3px hsl(var(--primary)/.15)`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = `hsl(var(--border))`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '700',
              marginBottom: '8px',
              color: `hsl(var(--card-foreground))`,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '10px',
                border: `1.5px solid hsl(var(--border))`,
                background: `hsl(var(--input))`,
                color: `hsl(var(--card-foreground))`,
                fontSize: '14px',
                fontWeight: '500',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = `hsl(var(--primary))`;
                e.currentTarget.style.boxShadow = `0 0 0 3px hsl(var(--primary)/.15)`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = `hsl(var(--border))`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {error && (
            <p style={{
              color: `hsl(var(--destructive))`,
              fontSize: '13px',
              marginBottom: '16px',
              padding: '12px 14px',
              background: `hsl(var(--destructive)/.1)`,
              borderRadius: '8px',
              border: `1px solid hsl(var(--destructive)/.3)`,
              fontWeight: '500',
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-dark)) 100%)`,
              color: `hsl(var(--primary-foreground))`,
              fontSize: '14px',
              fontWeight: '700',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: 'var(--shadow)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '12px',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow)';
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          fontSize: '13px',
          color: `hsl(var(--muted-foreground))`,
          marginBottom: '24px',
          paddingBottom: '24px',
          borderBottom: `1px solid hsl(var(--border))`,
        }}>
          <p>
            Don't have an account?{' '}
            <Link href="/signup" style={{
              color: `hsl(var(--primary))`,
              fontWeight: '700',
              textDecoration: 'none',
            }}>
              Create one
            </Link>
          </p>
        </div>

        <div style={{
          padding: '16px',
          background: `hsl(var(--muted))`,
          borderRadius: '10px',
          border: `1.5px solid hsl(var(--border))`,
          fontSize: '12px',
          color: "white",
          lineHeight: '1.8',
        }}>
          <p style={{ fontWeight: '700', marginBottom: '8px', color: "white" }}>Demo Credentials</p>
          <p>📧 Email: demo@example.com</p>
          <p>🔑 Password: anything</p>
        </div>
      </div>
    </div>
  );
}
