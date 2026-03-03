'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '@/lib/redux-store';
import { cacheStorage } from '@/lib/cache-storage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Demo signup - in production, call your backend API
      const mockUser = {
        id: Math.random().toString(),
        email: formData.email,
        fullName: formData.fullName,
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
      setError(err instanceof Error ? err.message : 'Signup failed');
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
      background: `linear-gradient(135deg, hsl(var(--background)), hsl(var(--muted)))`,
      padding: '20px',
      backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary)) / 0.05 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, hsl(var(--accent)) / 0.05 0%, transparent 50%)`
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '12px',
            background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Liver Disease Prediction
          </h1>
          <p style={{
            fontSize: '14px',
            color: `hsl(var(--muted-foreground))`
          }}>
            Join thousands of patients getting early detection
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: `hsl(var(--card))`,
          borderRadius: '12px',
          border: `1px solid hsl(var(--border))`,
          padding: '40px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
            {/* Step 1 - Basic Info */}
            {step === 1 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '24px',
                  color: "white"
                }}>
                  Create Your Account
                </h2>

                <div style={{ marginBottom: '18px' }}>
                  <label htmlFor="fullName" style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: "white"
                  }}>
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: `1px solid hsl(var(--border))`,
                      background: `hsl(var(--input))`,
                      color: `hsl(var(--foreground))`,
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label htmlFor="email" style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: "white"
                  }}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: `1px solid hsl(var(--border))`,
                      background: `hsl(var(--input))`,
                      color: `hsl(var(--foreground))`,
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    background: `hsl(var(--primary))`,
                    color: `hsl(var(--primary-foreground))`,
                    fontSize: '14px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2 - Password */}
            {step === 2 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '24px',
                  color: "white"
                }}>
                  Set Your Password
                </h2>

                <div style={{ marginBottom: '18px' }}>
                  <label htmlFor="password" style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: "white"
                  }}>
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: `1px solid hsl(var(--border))`,
                      background: `hsl(var(--input))`,
                      color: `hsl(var(--foreground))`,
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease'
                    }}
                  />
                  <p style={{
                    fontSize: '12px',
                    color: `hsl(var(--muted-foreground))`,
                    marginTop: '6px'
                  }}>
                    Minimum 6 characters
                  </p>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label htmlFor="confirmPassword" style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: "white"
                  }}>
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: `1px solid hsl(var(--border))`,
                      background: `hsl(var(--input))`,
                      color: `hsl(var(--foreground))`,
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </div>

                {error && (
                  <p style={{
                    color: `hsl(var(--destructive))`,
                    fontSize: '13px',
                    marginBottom: '16px',
                    padding: '10px 12px',
                    background: `hsl(var(--destructive) / 0.1)`,
                    borderRadius: '6px'
                  }}>
                    {error}
                  </p>
                )}

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError('');
                    }}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: `hsl(var(--muted))`,
                      color: "white",
                      fontSize: '14px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: `hsl(var(--primary))`,
                      color: `hsl(var(--primary-foreground))`,
                      fontSize: '14px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.6 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            borderTop: `1px solid hsl(var(--border))`,
            paddingTop: '20px',
            fontSize: '14px',
            color: `hsl(var(--muted-foreground))`
          }}>
            <p>
              Already have an account?{' '}
              <Link href="/login" style={{
                color: `hsl(var(--primary))`,
                fontWeight: '600',
                textDecoration: 'underline'
              }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginTop: '24px'
        }}>
          <div style={{
            background: `hsl(var(--card))`,
            border: `1px solid hsl(var(--border))`,
            padding: '16px',
            borderRadius: '8px',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            <p style={{ color: `hsl(var(--muted-foreground))`, lineHeight: '1.4' }}>
              Your data is encrypted and secure
            </p>
          </div>
          <div style={{
            background: `hsl(var(--card))`,
            border: `1px solid hsl(var(--border))`,
            padding: '16px',
            borderRadius: '8px',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            <p style={{ color: `hsl(var(--muted-foreground))`, lineHeight: '1.4' }}>
              Privacy policy and terms apply
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
