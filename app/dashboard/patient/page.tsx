'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PatientDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { predictions } = useSelector((state: RootState) => state.predictions);
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Redirect unauthenticated users after initial render to avoid setState during render
  useEffect(() => {
    if (!user) {
      router.replace('/auth/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--muted-foreground))',
        }}
      >
        Redirecting to login…
      </div>
    );
  }

  const storedLastPrediction = JSON.parse(localStorage.getItem('lastPrediction') || '{}');

  const latestPrediction =
    predictions && predictions.length > 0 ? predictions[0] : null;

  const lastPrediction = latestPrediction
    ? {
        level: latestPrediction.hasDisease ? 'Disease' : 'No Disease',
        severity: latestPrediction.riskLevel,
        timestamp: new Date().toISOString(),
        color:
          latestPrediction.riskLevel === 'High'
            ? '#ef4444'
            : latestPrediction.riskLevel === 'Medium'
            ? '#f59e0b'
            : latestPrediction.riskLevel === 'Low'
            ? '#10b981'
            : '#06b6d4',
        formData: {
          totalBilirubin: latestPrediction.medicalMetrics?.totalBilirubin,
          platelets: latestPrediction.medicalMetrics?.platelets,
          albumin: latestPrediction.medicalMetrics?.albumin,
        },
      }
    : storedLastPrediction;

  const hasDisease =
    lastPrediction &&
    (lastPrediction.level === 'Disease' ||
      ['High', 'Medium', 'Low'].includes(lastPrediction.severity));

  const mockUpcomingAppointments = [
    { id: 1, doctor: 'Dr. Sarah Johnson', date: '2024-03-15', time: '10:00 AM', type: 'Liver Check-up' },
    { id: 2, doctor: 'Dr. Michael Chen', date: '2024-03-20', time: '2:00 PM', type: 'Routine Checkup' },
  ];

  const mockRecommendedDoctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Hepatology', rating: 4.9, patients: 2400 },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Internal Medicine', rating: 4.8, patients: 1800 },
    { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Gastroenterology', rating: 4.7, patients: 2100 },
  ];

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--secondary))/.1 100%)',
    padding: '40px 20px',
    backgroundAttachment: 'fixed',
  };

  const headerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  };

  const cardStyle: React.CSSProperties = {
    background: `hsl(var(--card))`,
    borderRadius: '12px',
    border: `1px solid hsl(var(--border))`,
    padding: '24px',
    boxShadow: 'var(--shadow)',
    backdropFilter: 'blur(10px)',
  };

  const riskCardStyle: React.CSSProperties = {
    ...cardStyle,
    background: `linear-gradient(135deg, ${lastPrediction.color || 'hsl(var(--primary))'} 0%, ${lastPrediction.color || 'hsl(var(--primary))'}dd 100%)`,
    color: 'white',
    textAlign: 'center',
    padding: '40px 24px',
    gridColumn: 'span 1',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    maxWidth: '1400px',
    margin: '0 auto 40px',
  };

  const tabButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    border: 'none',
    background: 'transparent',
    color: `hsl(var(--foreground))`,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    borderBottom: '2px solid transparent',
  };

  const tabButtonActiveStyle: React.CSSProperties = {
    ...tabButtonStyle,
    color: `hsl(var(--primary))`,
    borderBottomColor: `hsl(var(--primary))`,
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Welcome, {user.fullName}</h1>
          <p style={{ color: `hsl(var(--muted-foreground))` }}>Patient Dashboard</p>
        </div>
        <button
          onClick={() => { localStorage.clear(); router.push('/'); }}
          style={{
            padding: '10px 20px',
            background: `hsl(var(--muted))`,
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `hsl(var(--destructive))`;
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `hsl(var(--muted))`;
            e.currentTarget.style.color = 'inherit';
          }}
        >
          Logout
        </button>
      </div>

      <div style={gridStyle}>
        {lastPrediction && lastPrediction.level && (
          <div style={riskCardStyle}>
            <h3 style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px' }}>Current Risk Level</h3>
            <div style={{ fontSize: '48px', fontWeight: '700', marginBottom: '8px' }}>
              {lastPrediction.level}
            </div>
            <p style={{ opacity: 0.9, marginBottom: '8px' }}>{lastPrediction.severity} Risk</p>
            <p style={{ opacity: 0.9, fontSize: '14px' }}>
              Disease detected: <strong>{hasDisease ? 'Yes' : 'No'}</strong>
            </p>
          </div>
        )}

        <div style={cardStyle}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', color: `hsl(var(--muted-foreground))` }}>
            Health Metrics
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span>Total Bilirubin</span>
              <span style={{ fontWeight: '600' }}>{lastPrediction?.formData?.totalBilirubin || '--'} mg/dL</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingTop: '8px', borderTop: `1px solid hsl(var(--border))` }}>
              <span>Platelets</span>
              <span style={{ fontWeight: '600' }}>{lastPrediction?.formData?.platelets || '--'} K/L</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingTop: '8px', borderTop: `1px solid hsl(var(--border))` }}>
              <span>Albumin</span>
              <span style={{ fontWeight: '600' }}>{lastPrediction?.formData?.albumin || '--'} g/dL</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', color: `hsl(var(--muted-foreground))` }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/dashboard/patient/health-assessment" style={{
              padding: '10px 14px',
              background: `hsl(var(--primary))`,
              color: `hsl(var(--primary-foreground))`,
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              display: 'block',
            }}>
              New Assessment
            </Link>
            <Link href="/payment" style={{
              padding: '10px 14px',
              background: `hsl(var(--accent))`,
              color: `hsl(var(--accent-foreground))`,
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              display: 'block',
            }}>
              Make Payment
            </Link>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: `hsl(var(--card))`,
        borderRadius: '12px',
        border: `1px solid hsl(var(--border))`,
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{
          padding: '24px',
          borderBottom: `1px solid hsl(var(--border))`,
          display: 'flex',
          gap: '24px',
          overflowX: 'auto',
        }}>
          <button
            onClick={() => setSelectedTab('overview')}
            style={selectedTab === 'overview' ? tabButtonActiveStyle : tabButtonStyle}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab('appointments')}
            style={selectedTab === 'appointments' ? tabButtonActiveStyle : tabButtonStyle}
          >
            Appointments
          </button>
          <button
            onClick={() => setSelectedTab('doctors')}
            style={selectedTab === 'doctors' ? tabButtonActiveStyle : tabButtonStyle}
          >
            Doctors
          </button>
          <button
            onClick={() => setSelectedTab('history')}
            style={selectedTab === 'history' ? tabButtonActiveStyle : tabButtonStyle}
          >
            History
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {selectedTab === 'overview' && (
            <div>
              <h3 style={{ marginBottom: '16px' }}>Recent Activity</h3>
              <p style={{ color: `hsl(var(--muted-foreground))`, fontSize: '14px' }}>
                Last assessment: {lastPrediction.timestamp ? new Date(lastPrediction.timestamp).toLocaleDateString() : 'No assessments yet'}
              </p>
            </div>
          )}

          {selectedTab === 'appointments' && (
            <div>
              <h3 style={{ marginBottom: '24px' }}>Upcoming Appointments</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {mockUpcomingAppointments.map(apt => (
                  <div
                    key={apt.id}
                    style={{
                      padding: '16px',
                      background: `hsl(var(--muted))`,
                      borderRadius: '8px',
                      border: `1px solid hsl(var(--border))`,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong>{apt.doctor}</strong>
                      <span style={{ fontSize: '12px', color: `hsl(var(--muted-foreground))` }}>{apt.date}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: `hsl(var(--muted-foreground))` }}>{apt.type} at {apt.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'doctors' && (
            <div>
              <h3 style={{ marginBottom: '24px' }}>Recommended Doctors</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                {mockRecommendedDoctors.map(doc => (
                  <div
                    key={doc.id}
                    style={{
                      padding: '16px',
                      background: `hsl(var(--muted))`,
                      borderRadius: '8px',
                      border: `1px solid hsl(var(--border))`,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <h4 style={{ marginBottom: '8px' }}>{doc.name}</h4>
                    <p style={{ fontSize: '12px', color: `hsl(var(--muted-foreground))`, marginBottom: '12px' }}>{doc.specialty}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '12px' }}>
                      <span>⭐ {doc.rating}</span>
                      <span>{doc.patients.toLocaleString()} Patients</span>
                    </div>
                    <button style={{
                      width: '100%',
                      padding: '8px',
                      background: `hsl(var(--primary))`,
                      color: `hsl(var(--primary-foreground))`,
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = 'var(--shadow)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    >
                      Book Appointment
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'history' && (
            <div>
              <h3 style={{ marginBottom: '24px' }}>Health Assessment History</h3>
              <p style={{ color: `hsl(var(--muted-foreground))`, fontSize: '14px' }}>
                {lastPrediction.timestamp ? `Last assessment on ${new Date(lastPrediction.timestamp).toLocaleDateString()}` : 'No assessment history'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
