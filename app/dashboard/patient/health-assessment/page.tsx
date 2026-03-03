'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setPredictions } from '@/lib/redux-store';
import { cacheStorage } from '@/lib/cache-storage';

interface RiskResult {
  riskLevel: string;
  riskScore: number;
  recommendations: string[];
}

const INPUT_FIELDS = [
  { name: 'age', label: 'Age', type: 'number', placeholder: '25', required: true },
  { name: 'gender', label: 'Gender', type: 'select', options: ['male', 'female', 'other'], required: true },
  { name: 'totalBilirubin', label: 'Total Bilirubin (mg/dL)', type: 'number', placeholder: '0.5', step: 0.1, required: true },
  { name: 'directBilirubin', label: 'Direct Bilirubin (mg/dL)', type: 'number', placeholder: '0.1', step: 0.1, required: true },
  { name: 'alkalinePhosphatase', label: 'Alkaline Phosphatase (U/L)', type: 'number', placeholder: '44', required: true },
  { name: 'sgpt', label: 'SGPT/ALT (U/L)', type: 'number', placeholder: '33', required: true },
  { name: 'sgot', label: 'SGOT/AST (U/L)', type: 'number', placeholder: '32', required: true },
  { name: 'totalProteins', label: 'Total Proteins (g/dL)', type: 'number', placeholder: '6.5', step: 0.1, required: true },
  { name: 'albumin', label: 'Albumin (g/dL)', type: 'number', placeholder: '3.5', step: 0.1, required: true },
  { name: 'albuminGlobulinRatio', label: 'Albumin/Globulin Ratio', type: 'number', placeholder: '1.0', step: 0.1, required: true },
];

const RISK_COLORS = {
  None: 'bg-green-50 border-green-200',
  Low: 'bg-yellow-50 border-yellow-200',
  Medium: 'bg-orange-50 border-orange-200',
  High: 'bg-red-50 border-red-200',
};

const RISK_BADGE_COLORS = {
  None: 'bg-green-100 text-green-800',
  Low: 'bg-yellow-100 text-yellow-800',
  Medium: 'bg-orange-100 text-orange-800',
  High: 'bg-red-100 text-red-800',
};

export default function HealthAssessmentPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<Record<string, any>>({
    age: '',
    gender: 'male',
    totalBilirubin: '',
    directBilirubin: '',
    alkalinePhosphatase: '',
    sgpt: '',
    sgot: '',
    totalProteins: '',
    albumin: '',
    albuminGlobulinRatio: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskResult | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'age' ? parseInt(value) || '' : parseFloat(value) || '' });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-id': user.id,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to process assessment');
        return;
      }

      const prediction = {
        ...data.prediction,
        hasDisease: data.prediction.riskLevel !== 'None',
      };

      // Store in local state for this page
      setResult(prediction);

      // Store in Redux for global access
      dispatch(setPredictions([prediction]));

      // Store in cacheStorage for persistence
      cacheStorage.setPredictions([prediction]);

      // Mirror to simple dashboard "lastPrediction" format
      const color =
        prediction.riskLevel === 'High'
          ? '#ef4444'
          : prediction.riskLevel === 'Medium'
            ? '#f59e0b'
            : prediction.riskLevel === 'Low'
              ? '#10b981'
              : '#06b6d4';

      const lastPrediction = {
        level: prediction.riskLevel === 'None' ? 'No Disease' : 'Disease',
        severity: prediction.riskLevel,
        timestamp: new Date().toISOString(),
        color,
        formData: {
          totalBilirubin: prediction.medicalMetrics?.totalBilirubin,
          albumin: prediction.medicalMetrics?.albumin,
          // platelets not part of this schema; leave undefined so dashboard shows "--"
        },
      };

      localStorage.setItem('lastPrediction', JSON.stringify(lastPrediction));
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/patient')}
            className="mb-6"
          >
            ← Back to Dashboard
          </Button>

          <Card className={`border-2 ${RISK_COLORS[result.riskLevel as keyof typeof RISK_COLORS]}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Assessment Results</CardTitle>
                <span className={`rounded-full px-4 py-2 text-sm font-semibold ${RISK_BADGE_COLORS[result.riskLevel as keyof typeof RISK_BADGE_COLORS]}`}>
                  {result.riskLevel} Risk
                </span>
              </div>
              <CardDescription>Your liver health assessment has been completed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <p className="text-4xl font-bold text-primary">{result.riskScore}</p>
                  <p className="text-xs text-muted-foreground">out of 100</p>
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      result.riskScore < 25 ? 'bg-green-500' :
                      result.riskScore < 50 ? 'bg-yellow-500' :
                      result.riskScore < 75 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${result.riskScore}%` }}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="text-primary font-bold">✓</span>
                      <span className="text-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Bilirubin</p>
                  <p className="font-semibold">{result.medicalMetrics?.totalBilirubin} mg/dL</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Direct Bilirubin</p>
                  <p className="font-semibold">{result.medicalMetrics?.directBilirubin} mg/dL</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">SGPT/ALT</p>
                  <p className="font-semibold">{result.medicalMetrics?.sgpt} U/L</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">SGOT/AST</p>
                  <p className="font-semibold">{result.medicalMetrics?.sgot} U/L</p>
                </div>
              </div>

              {result.riskLevel === 'High' || result.riskLevel === 'Medium' ? (
                <Button
                  onClick={() => router.push('/doctors')}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10"
                >
                  Book Appointment with Doctor
                </Button>
              ) : (
                <Button
                  onClick={() => router.push('/dashboard/patient')}
                  variant="outline"
                  className="w-full"
                >
                  Return to Dashboard
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Liver Health Assessment</h1>
          <p className="text-muted-foreground">
            Complete this medical assessment to get your liver health risk evaluation. Please provide accurate lab values.
          </p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Medical Metrics</CardTitle>
            <CardDescription>Fill in your recent lab test results</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {INPUT_FIELDS.map((field) => (
                  <div key={field.name} className={field.type === 'select' ? 'col-span-2' : ''}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    {field.type === 'select' ? (
                      <Select
                        value={formData[field.name]}
                        onValueChange={(value) => handleSelectChange(field.name, value)}
                        disabled={loading}
                      >
                        <SelectTrigger id={field.name}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        step={field.step || 1}
                        value={formData[field.name]}
                        onChange={handleChange}
                        disabled={loading}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Assessment...
                  </>
                ) : (
                  'Get Risk Assessment'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
