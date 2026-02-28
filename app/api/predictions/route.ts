import { getDb } from '@/lib/db-sqlite';
import { healthAssessmentSchema } from '@/lib/validators';
import { NextRequest, NextResponse } from 'next/server';
import { handleError, AppError } from '@/lib/api';
import crypto from 'crypto';

// Mock ML prediction function (replace with actual API call)
function calculateRiskLevel(metrics: any): { level: string; score: number; recommendations: string[] } {
  const { bilirubin, alkalinePhosphatase, sgpt, sgot, albumin } = metrics;
  
  let riskScore = 0;

  // Scoring logic based on medical parameters
  if (bilirubin > 1.2) riskScore += (bilirubin > 2 ? 30 : 15);
  if (alkalinePhosphatase > 120) riskScore += (alkalinePhosphatase > 300 ? 20 : 10);
  if (sgpt > 40) riskScore += (sgpt > 100 ? 25 : 15);
  if (sgot > 40) riskScore += (sgot > 100 ? 25 : 15);
  if (albumin < 3.5) riskScore += (albumin < 3 ? 20 : 10);

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
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      throw new AppError(401, 'User ID not found');
    }

    const db = getDb();

    // Calculate risk level
    const { level, score, recommendations } = calculateRiskLevel(parsed.data);

    // Create health record
    const healthRecordId = crypto.randomUUID();
    const predictionId = crypto.randomUUID();

    const insertHealthRecord = db.prepare(`
      INSERT INTO health_records (id, userId, age, sex, alcohol, bilirubin, alkalinePhosphatase, sgpt, sgot, totalProtein, albumin, ratioCorrectedCalcium)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertHealthRecord.run(
      healthRecordId,
      userId,
      parsed.data.age,
      parsed.data.sex,
      parsed.data.alcohol,
      parsed.data.bilirubin,
      parsed.data.alkalinePhosphatase,
      parsed.data.sgpt,
      parsed.data.sgot,
      parsed.data.totalProtein,
      parsed.data.albumin,
      parsed.data.ratioCorrectedCalcium
    );

    // Create prediction record
    const insertPrediction = db.prepare(`
      INSERT INTO predictions (id, userId, healthRecordId, riskScore, riskLevel, recommendation)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertPrediction.run(
      predictionId,
      userId,
      healthRecordId,
      score,
      level,
      recommendations.join('; ')
    );

    return NextResponse.json(
      {
        success: true,
        prediction: {
          id: predictionId,
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

    const db = getDb();

    const predictions = db
      .prepare(`
        SELECT * FROM predictions 
        WHERE userId = ? 
        ORDER BY createdAt DESC 
        LIMIT 10
      `)
      .all(userId);

    return NextResponse.json({
      predictions,
    });
  } catch (error) {
    return handleError(error);
  }
}
