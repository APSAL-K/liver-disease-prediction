'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HealthAssessmentPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    totalBilirubin: '',
    alkalinePhosphatase: '',
    alamineAminotransferase: '',
    aspartateAminotransferase: '',
    platelets: '',
    albumin: '',
    prothrombinTime: '',
    alcoholConsumption: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateRiskLevel = () => {
    const totalBil = parseFloat(formData.totalBilirubin) || 0;
    const alkPhos = parseFloat(formData.alkalinePhosphatase) || 0;
    const alt = parseFloat(formData.alamineAminotransferase) || 0;
    const ast = parseFloat(formData.aspartateAminotransferase) || 0;
    const platelets = parseFloat(formData.platelets) || 0;
    const albumin = parseFloat(formData.albumin) || 0;

    let score = 0;
    if (totalBil > 1.2) score += 2;
    if (alkPhos > 120) score += 2;
    if (alt > 40 || ast > 40) score += 3;
    if (platelets < 150) score += 2;
    if (albumin < 3.5) score += 2;

    if (score >= 9) return { level: 'High', color: '#ef4444', severity: 'Critical' };
    if (score >= 5) return { level: 'Medium', color: '#f59e0b', severity: 'Moderate' };
    if (score > 0) return { level: 'Low', color: '#10b981', severity: 'Mild' };
    return { level: 'No Disease', color: '#06b6d4', severity: 'Healthy' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const riskResult = calculateRiskLevel();
      setResult({
        ...riskResult,
        timestamp: new Date().toISOString(),
        formData,
      });
      setStep(2);
      setLoading(false);
    }, 1500);
  };

  const savePrediction = () => {
    localStorage.setItem('lastPrediction', JSON.stringify(result));
    router.push('/dashboard');
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--secondary))/.1 100%)',
    padding: '40px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const formContainerStyle: React.CSSProperties = {
    maxWidth: '600px',
    width: '100%',
    background: `hsl(var(--card))`,
    borderRadius: '16px',
    border: `1px solid hsl(var(--border))`,
    padding: '40px',
    backdropFilter: 'blur(10px)',
    boxShadow: 'var(--shadow-lg)',
    animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const inputGroupStyle: React.CSSProperties = {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    color: `hsl(var(--foreground))`,
  };

  const inputStyle: React.CSSProperties = {
    padding: '12px 14px',
    borderRadius: '8px',
    border: `1px solid hsl(var(--border))`,
    background: `hsl(var(--input))`,
    color: `hsl(var(--foreground))`,
    fontSize: '14px',
    transition: 'all 0.2s ease',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: '8px',
    background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-dark)) 100%)`,
    color: `hsl(var(--primary-foreground))`,
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: 'var(--shadow)',
  };

  const resultCardStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px',
    borderRadius: '16px',
    background: `hsl(var(--card))`,
    border: `1px solid hsl(var(--border))`,
    boxShadow: 'var(--shadow-lg)',
  };

  const riskLevelStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: '700',
    color: result?.color,
    marginBottom: '16px',
    letterSpacing: '-0.02em',
  };

  if (step === 2 && result) {
    return (
      <div style={containerStyle}>
        <div style={resultCardStyle}>
          <h2 style={{ marginBottom: '20px' }}>Assessment Result</h2>
          <div style={riskLevelStyle}>{result.level}</div>
          <p style={{ fontSize: '18px', marginBottom: '24px', color: `hsl(var(--muted-foreground))` }}>
            Risk Level: {result.severity}
          </p>
          
          <div style={{
            background: `hsl(var(--muted))`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'left',
          }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Biomarkers Analyzed</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
              <p><strong>Total Bilirubin:</strong> {formData.totalBilirubin} mg/dL</p>
              <p><strong>Alkaline Phosphatase:</strong> {formData.alkalinePhosphatase} U/L</p>
              <p><strong>ALT:</strong> {formData.alamineAminotransferase} U/L</p>
              <p><strong>AST:</strong> {formData.aspartateAminotransferase} U/L</p>
              <p><strong>Platelets:</strong> {formData.platelets} K/L</p>
              <p><strong>Albumin:</strong> {formData.albumin} g/dL</p>
            </div>
          </div>

          <button
            onClick={savePrediction}
            style={{
              ...buttonStyle,
              width: '100%',
              marginBottom: '12px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Save & Continue to Dashboard
          </button>

          <button
            onClick={() => { setStep(0); setFormData(Object.fromEntries(Object.keys(formData).map(k => [k, '']))); }}
            style={{
              ...buttonStyle,
              background: `hsl(var(--muted))`,
              color: `hsl(var(--foreground))`,
              width: '100%',
            }}
          >
            Take Another Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <Link href="/" style={{ display: 'inline-block', marginBottom: '24px', fontSize: '14px' }}>
          ← Back Home
        </Link>

        <h1 style={{ marginBottom: '12px', fontSize: '28px' }}>Health Assessment</h1>
        <p style={{ color: `hsl(var(--muted-foreground))`, marginBottom: '32px' }}>
          Liver Disease Risk Evaluation
        </p>

        <form onSubmit={handleSubmit}>
          {step === 0 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Age</label>
                  <input
                    style={inputStyle}
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="30"
                    required
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Gender</label>
                  <select
                    style={inputStyle}
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <h3 style={{ fontSize: '16px', marginBottom: '16px', marginTop: '32px' }}>Liver Function Tests</h3>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Total Bilirubin (mg/dL)</label>
                <input
                  style={inputStyle}
                  type="number"
                  step="0.1"
                  name="totalBilirubin"
                  value={formData.totalBilirubin}
                  onChange={handleChange}
                  placeholder="0.3 - 1.2"
                  required
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Alkaline Phosphatase (U/L)</label>
                <input
                  style={inputStyle}
                  type="number"
                  name="alkalinePhosphatase"
                  value={formData.alkalinePhosphatase}
                  onChange={handleChange}
                  placeholder="40 - 120"
                  required
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>ALT (U/L)</label>
                <input
                  style={inputStyle}
                  type="number"
                  name="alamineAminotransferase"
                  value={formData.alamineAminotransferase}
                  onChange={handleChange}
                  placeholder="7 - 56"
                  required
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>AST (U/L)</label>
                <input
                  style={inputStyle}
                  type="number"
                  name="aspartateAminotransferase"
                  value={formData.aspartateAminotransferase}
                  onChange={handleChange}
                  placeholder="10 - 40"
                  required
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Platelets (K/L)</label>
                <input
                  style={inputStyle}
                  type="number"
                  name="platelets"
                  value={formData.platelets}
                  onChange={handleChange}
                  placeholder="150 - 400"
                  required
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Albumin (g/dL)</label>
                <input
                  style={inputStyle}
                  type="number"
                  step="0.1"
                  name="albumin"
                  value={formData.albumin}
                  onChange={handleChange}
                  placeholder="3.5 - 5.5"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...buttonStyle,
                  width: '100%',
                  opacity: loading ? 0.6 : 1,
                  marginTop: '32px',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {loading ? 'Analyzing...' : 'Analyze Results'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
