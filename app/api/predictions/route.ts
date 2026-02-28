import { connectDB } from '@/lib/db';
import { Prediction } from '@/lib/models/Prediction';
import { healthAssessmentSchema } from '@/lib/validators';
import { NextRequest, NextResponse } from 'next/server';
import { handleError, AppError } from '@/lib/api';
import axios from 'axios';

// Mock ML prediction function (replace with actual API call)
function calculateRiskLevel(metrics: any): { level: string; score: number; recommendations: string[] } {
  const { totalBilirubin, directBilirubin, alkalinePhosphatase, sgpt, sgot, albumin, albuminGlobulinRatio } = metrics;
  
  let riskScore = 0;

  // Scoring logic based on medical parameters
  if (totalBilirubin > 1.2) riskScore += (totalBilirubin > 2 ? 30 : 15);
  if (directBilirubin > 0.3) riskScore += (directBilirubin > 0.8 ? 25 : 12);
  if (alkalinePhosphatase > 120) riskScore += (alkalinePhosphatase > 300 ? 20 : 10);
  if (sgpt > 40) riskScore += (sgpt > 100 ? 25 : 15);
  if (sgot > 40) riskScore += (sgot > 100 ? 25 : 15);
  if (albumin < 3.5) riskScore += (albumin < 3 ? 20 : 10);
  if (albuminGlobulinRatio < 1.0) riskScore += (albuminGlobulinRatio < 0.7 ? 20 : 10);

  let riskLevel = 'None';
  let recommendations: string[] = [];

  if (riskScore >= 80) {
    riskLevel = 'High';
    recommendations = [
      'Schedule an urgent consultation with a hepatologist',
      'Consider liver function tests immediately',
      'Avoid alcohol and hepatotoxic medications',
      'Monitor symptoms closely',
    ];
  } else if (riskScore >= 50) {
    riskLevel = 'Medium';
    recommendations = [
      'Schedule a consultation with a liver specialist',
      'Get comprehensive liver tests done',
      'Maintain a healthy lifestyle',
      'Avoid alcohol consumption',
    ];
  } else if (riskScore >= 25) {
    riskLevel = 'Low';
    recommendations = ['Regular check-ups recommended', 'Maintain a balanced diet', 'Stay physically active'];
  } else {
    riskLevel = 'None';
    recommendations = ['Maintain current healthy lifestyle', 'Annual health checkups recommended'];
  }

  return { level: riskLevel, score: Math.min(riskScore, 100), recommendations };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = healthAssessmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.errors },
        { status: 400 }
      );
    }

    // Get user ID from auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      throw new AppError(401, 'Unauthorized');
    }

    const userId = request.headers.get('x-user-id');
    if (!userId) {
      throw new AppError(401, 'User ID not found');
    }

    await connectDB();

    // Calculate risk level
    const { level, score, recommendations } = calculateRiskLevel(parsed.data);

    // Create prediction record
    const prediction = new Prediction({
      userId,
      medicalMetrics: parsed.data,
      riskLevel: level,
      riskScore: score,
      recommendations,
    });

    await prediction.save();

    return NextResponse.json(
      {
        success: true,
        prediction: {
          id: prediction._id,
          riskLevel: level,
          riskScore: score,
          recommendations,
          medicalMetrics: parsed.data,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      throw new AppError(401, 'User ID not found');
    }

    await connectDB();

    const predictions = await Prediction.find({ userId }).sort({ createdAt: -1 }).limit(10);

    return NextResponse.json({
      predictions,
    });
  } catch (error) {
    return handleError(error);
  }
}
