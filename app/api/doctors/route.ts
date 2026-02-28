import { getDb } from '@/lib/db-sqlite';
import { NextRequest, NextResponse } from 'next/server';
import { handleError, AppError } from '@/lib/api';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, specialty, qualifications, clinicName, clinicAddress, consultationFee, experience } = body;

    if (!userId) {
      throw new AppError(400, 'User ID is required');
    }

    const db = getDb();

    // Check if doctor already exists for this user
    const existingDoctor = db.prepare('SELECT id FROM doctors WHERE userId = ?').get(userId);
    if (existingDoctor) {
      throw new AppError(400, 'Doctor profile already exists for this user');
    }

    const doctorId = crypto.randomUUID();
    const insertDoctor = db.prepare(`
      INSERT INTO doctors (id, userId, specialty, qualifications, clinicName, clinicAddress, consultationFee, experience)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertDoctor.run(doctorId, userId, specialty, qualifications, clinicName, clinicAddress, consultationFee || 500, experience || 0);

    return NextResponse.json({ id: doctorId, message: 'Doctor profile created' }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get('specialty');

    const db = getDb();

    let query = 'SELECT d.*, u.fullName FROM doctors d JOIN users u ON d.userId = u.id';
    let params: any[] = [];

    if (specialty) {
      query += ' WHERE d.specialty LIKE ?';
      params.push(`%${specialty}%`);
    }

    query += ' ORDER BY d.rating DESC';

    const doctors = db.prepare(query).all(...params);

    return NextResponse.json({ doctors }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
