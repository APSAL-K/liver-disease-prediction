'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux-store';
import Link from 'next/link';

export default function HomePage() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: `hsl(var(--background))` }}>
      {/* Navigation */}
      <nav style={{
        borderBottom: `1px solid hsl(var(--border))`,
        position: 'sticky',
        top: 0,
        background: `hsl(var(--background) / 0.95)`,
        backdropFilter: 'blur(10px)',
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: `hsl(var(--foreground))`
          }}>
            <span style={{
              width: '32px',
              height: '32px',
              background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))`,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px'
            }}>
              ❤️
            </span>
            <span>LiverCare</span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {isLoggedIn ? (
              <Link href="/dashboard" style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: `hsl(var(--primary))`,
                color: `hsl(var(--primary-foreground))`,
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }} onMouseOver={(e) => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }} onMouseOut={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: `1px solid hsl(var(--border))`,
                  background: `hsl(var(--card))`,
                  color: `hsl(var(--foreground))`,
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }} onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = `hsl(var(--primary))`;
                  e.currentTarget.style.color = `hsl(var(--primary))`;
                }} onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = `hsl(var(--border))`;
                  e.currentTarget.style.color = `hsl(var(--foreground))`;
                }}>
                  Login
                </Link>
                <Link href="/signup" style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: `hsl(var(--primary))`,
                  color: `hsl(var(--primary-foreground))`,
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }} onMouseOver={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }} onMouseOut={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '80px 24px',
        background: `linear-gradient(135deg, hsl(var(--background)), hsl(var(--muted))),
                    radial-gradient(circle at 20% 50%, hsl(var(--primary)) / 0.05 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, hsl(var(--accent)) / 0.05 0%, transparent 50%)`
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <h1 style={{
            fontSize: '56px',
            fontWeight: '700',
            lineHeight: '1.2',
            color: `hsl(var(--foreground))`,
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            Advanced Liver Disease <span style={{
              background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Prediction & Care</span>
          </h1>
          <p style={{
            fontSize: '18px',
            color: `hsl(var(--muted-foreground))`,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Harness the power of AI-driven health assessment and connect with expert hepatologists for personalized liver health management.
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '16px'
          }}>
            <Link href="/signup" style={{
              padding: '14px 32px',
              borderRadius: '8px',
              background: `hsl(var(--primary))`,
              color: `hsl(var(--primary-foreground))`,
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.2s ease',
              border: '1px solid transparent'
            }} onMouseOver={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }} onMouseOut={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              Get Started Now
            </Link>
            <Link href="/login" style={{
              padding: '14px 32px',
              borderRadius: '8px',
              background: `hsl(var(--card))`,
              color: `hsl(var(--foreground))`,
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.2s ease',
              border: `1px solid hsl(var(--border))`
            }} onMouseOver={(e) => {
              e.currentTarget.style.borderColor = `hsl(var(--primary))`;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }} onMouseOut={(e) => {
              e.currentTarget.style.borderColor = `hsl(var(--border))`;
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{
        padding: '80px 24px',
        background: `hsl(var(--muted) / 0.3)`
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '48px',
            color: `hsl(var(--foreground))`
          }}>
            Powerful Features
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                icon: '🧠',
                title: 'AI-Powered Assessment',
                description: 'Advanced machine learning models analyze your health parameters to predict liver disease risk with high accuracy.'
              },
              {
                icon: '👥',
                title: 'Expert Doctors',
                description: 'Connect with verified hepatologists and medical professionals for personalized consultations and guidance.'
              },
              {
                icon: '🔒',
                title: 'Secure & Private',
                description: 'Your health data is encrypted and protected with enterprise-grade security standards.'
              },
              {
                icon: '📊',
                title: 'Real-time Monitoring',
                description: 'Track your health metrics and receive personalized insights based on your unique profile.'
              },
              {
                icon: '💡',
                title: 'Personalized Insights',
                description: 'Get actionable recommendations tailored to your health status and risk factors.'
              },
              {
                icon: '⚡',
                title: 'Instant Results',
                description: 'Complete assessment and get AI-powered results in minutes, not days.'
              }
            ].map((feature, i) => (
              <div key={i} style={{
                background: `hsl(var(--card))`,
                border: `1px solid hsl(var(--border))`,
                borderRadius: '12px',
                padding: '32px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }} onMouseOver={(e) => {
                e.currentTarget.style.borderColor = `hsl(var(--primary))`;
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 12px 32px hsl(var(--primary) / 0.1)`;
              }} onMouseOut={(e) => {
                e.currentTarget.style.borderColor = `hsl(var(--border))`;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: `hsl(var(--foreground))`
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: `hsl(var(--muted-foreground))`,
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 24px',
        background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))`
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px'
          }}>
            Ready to Take Control of Your Health?
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Join thousands of patients who have already discovered their liver health status. Start your assessment today.
          </p>
          <Link href="/signup" style={{
            display: 'inline-block',
            padding: '14px 40px',
            borderRadius: '8px',
            background: 'white',
            color: `hsl(var(--primary))`,
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'all 0.2s ease'
          }} onMouseOver={(e) => {
            e.currentTarget.style.opacity = '0.9';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }} onMouseOut={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid hsl(var(--border))`,
        padding: '32px 24px',
        background: `hsl(var(--muted) / 0.2)`,
        textAlign: 'center',
        color: `hsl(var(--muted-foreground))`,
        fontSize: '14px'
      }}>
        <p>© 2024 LiverCare. All rights reserved. Privacy Policy • Terms of Service</p>
      </footer>
    </div>
  );
}
