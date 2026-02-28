'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Heart, TrendingDown, TrendingUp } from 'lucide-react';

interface Prediction {
  _id: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  parameters: Record<string, any>;
  recommendations: string[];
  createdAt: string;
}

const riskLevelColors: Record<string, string> = {
  low: 'bg-green-50 text-green-700 border-green-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  high: 'bg-red-50 text-red-700 border-red-200',
};

const riskLevelIcons: Record<string, any> = {
  low: TrendingDown,
  medium: AlertCircle,
  high: TrendingUp,
};

export default function PredictionResultsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await fetch('/api/predictions');
      const data = await response.json();
      if (data.success) {
        setPredictions(data.data);
        if (data.data.length > 0) {
          setSelectedPrediction(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Health Assessment Results</h1>
        <p className="text-muted-foreground mt-2">Review your liver disease risk assessment</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      ) : predictions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No assessments yet</p>
            <Button onClick={() => window.location.href = '/dashboard/patient/health-assessment'}>
              Take Health Assessment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Results List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Previous Assessments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {predictions.map(pred => (
                  <button
                    key={pred._id}
                    onClick={() => setSelectedPrediction(pred)}
                    className={`w-full text-left p-3 rounded border-2 transition-colors ${
                      selectedPrediction?._id === pred._id
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <p className="text-sm font-medium">
                      {new Date(pred.createdAt).toLocaleDateString()}
                    </p>
                    <p className={`text-xs font-semibold ${
                      pred.riskLevel === 'low' ? 'text-green-600' :
                      pred.riskLevel === 'medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {pred.riskLevel.toUpperCase()} RISK
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <div className="lg:col-span-2 space-y-6">
            {selectedPrediction && (
              <>
                {/* Risk Score */}
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className={`p-6 rounded-lg border-2 ${riskLevelColors[selectedPrediction.riskLevel]}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium mb-1">Risk Level</p>
                          <p className="text-3xl font-bold">
                            {selectedPrediction.riskLevel.toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium mb-1">Risk Score</p>
                          <p className="text-3xl font-bold">
                            {(selectedPrediction.riskScore * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Assessment Details */}
                    <div>
                      <h3 className="font-semibold mb-3">Assessment Parameters</h3>
                      <div className="space-y-2">
                        {Object.entries(selectedPrediction.parameters).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center p-3 bg-muted rounded">
                            <span className="text-sm font-medium capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="font-semibold text-foreground">
                              {typeof value === 'number' ? value.toFixed(2) : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h3 className="font-semibold mb-3">Recommendations</h3>
                      <div className="space-y-2">
                        {selectedPrediction.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex gap-3 p-3 bg-muted rounded">
                            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            <p className="text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Doctor Consultation */}
                    <Button
                      onClick={() => window.location.href = '/dashboard/patient/browse-doctors'}
                      className="w-full"
                    >
                      Consult with a Doctor
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
