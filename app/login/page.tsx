'use client';

import React, { useState } from 'react';
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
      background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--secondary))/.1 100%)',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.5s ease-out',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: `hsl(var(--card))`,
        borderRadius: '16px',
        border: `1px solid hsl(var(--border))`,
        boxShadow: 'var(--shadow-lg)',
        backdropFilter: 'blur(10px)',
        padding: '48px 32px',
        animation: 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '8px',
          color: `hsl(var(--foreground))`,
          letterSpacing: '-0.02em',
        }}>
          Sign In
        </h1>
        
        <p style={{
          fontSize: '14px',
          color: `hsl(var(--muted-foreground))`,
          marginBottom: '32px',
        }}>
          Liver Disease Prediction System
        </p>

        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email" style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '8px',
              color: `hsl(var(--foreground))`,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: `1px solid hsl(var(--border))`,
                background: `hsl(var(--input))`,
                color: `hsl(var(--foreground))`,
                fontSize: '14px',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = `hsl(var(--primary))`;
                e.currentTarget.style.boxShadow = 'var(--shadow)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = `hsl(var(--border))`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '8px',
              color: `hsl(var(--foreground))`,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
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
                padding: '12px 14px',
                borderRadius: '8px',
                border: `1px solid hsl(var(--border))`,
                background: `hsl(var(--input))`,
                color: `hsl(var(--foreground))`,
                fontSize: '14px',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = `hsl(var(--primary))`;
                e.currentTarget.style.boxShadow = 'var(--shadow)';
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
              padding: '10px 12px',
              background: `hsl(var(--destructive)/.1)`,
              borderRadius: '6px',
              border: `1px solid hsl(var(--destructive)/.3)`,
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-dark)) 100%)`,
              color: `hsl(var(--primary-foreground))`,
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: 'var(--shadow)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
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
              fontWeight: '600',
              textDecoration: 'none',
            }}>
              Create one
            </Link>
          </p>
        </div>

        <div style={{
          padding: '16px',
          background: `hsl(var(--muted)/.3)`,
          borderRadius: '8px',
          border: `1px solid hsl(var(--border))`,
          fontSize: '12px',
          color: `hsl(var(--muted-foreground))`,
          lineHeight: '1.6',
        }}>
          <p style={{ fontWeight: '600', marginBottom: '8px' }}>Demo Credentials:</p>
          <p>📧 Email: demo@example.com</p>
          <p>🔐 Password: anything</p>
        </div>
      </div>
    </div>
  );
}
