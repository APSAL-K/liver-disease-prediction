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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: `linear-gradient(to bottom, hsl(var(--background)), hsl(var(--muted)))`,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: `hsl(var(--card))`,
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: `1px solid hsl(var(--border))`,
        padding: '32px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: `hsl(var(--foreground))`
        }}>
          Liver Disease Prediction
        </h1>
        
        <p style={{
          fontSize: '14px',
          color: `hsl(var(--muted-foreground))`,
          marginBottom: '24px'
        }}>
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="email" style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
              color: `hsl(var(--foreground))`
            }}>
              Email
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
                padding: '10px',
                borderRadius: '4px',
                border: `1px solid hsl(var(--input))`,
                background: `hsl(var(--input))`,
                color: `hsl(var(--foreground))`,
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
              color: `hsl(var(--foreground))`
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
                padding: '10px',
                borderRadius: '4px',
                border: `1px solid hsl(var(--input))`,
                background: `hsl(var(--input))`,
                color: `hsl(var(--foreground))`,
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <p style={{
              color: `hsl(var(--destructive))`,
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              background: `hsl(var(--primary))`,
              color: `hsl(var(--primary-foreground))`,
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          color: `hsl(var(--muted-foreground))`,
          marginBottom: '16px'
        }}>
          <p>
            Don't have an account?{' '}
            <Link href="/signup" style={{
              color: `hsl(var(--primary))`,
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Sign up
            </Link>
          </p>
        </div>

        <div style={{
          padding: '12px',
          background: `hsl(var(--muted))`,
          borderRadius: '4px',
          fontSize: '12px',
          color: `hsl(var(--muted-foreground))`
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Demo Credentials:</p>
          <p>Email: demo@example.com</p>
          <p>Password: anything</p>
        </div>
      </div>
    </div>
  );
}
