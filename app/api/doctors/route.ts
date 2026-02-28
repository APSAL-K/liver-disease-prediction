'use server';

import { getDbConnection } from '@/lib/db-mysql';
import { NextRequest, NextResponse } from 'next/server';
import { handleError, AppError } from '@/lib/api';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const specialty = request.nextUrl.searchParams.get('specialty');
    const conn = await getDbConnection();

    let query = `
      SELECT d.*, u.fullName, u.email 
      FROM doctors d
      JOIN users u ON d.userId = u.id
      WHERE u.role = 'doctor'
    `;

    const params: any[] = [];

    if (specialty) {
      query += ` AND d.specialty LIKE ?`;
      params.push(`%${specialty}%`);
    }

    query += ` ORDER BY d.rating DESC LIMIT 50`;

    const [doctors] = await conn.execute(query, params) as any;

    return NextResponse.json({ doctors });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const doctorId = request.headers.get('x-user-id');

    if (!doctorId) {
      throw new AppError(401, 'User ID not found');
    }

    const conn = await getDbConnection();

    // Check if doctor profile already exists
    const [existingDoctors] = await conn.execute(
      'SELECT id FROM doctors WHERE userId = ?',
      [doctorId]
    ) as any;

    if (existingDoctors.length > 0) {
      throw new AppError(400, 'Doctor profile already exists');
    }

    const id = crypto.randomUUID();

    await conn.execute(
      `INSERT INTO doctors (id, userId, specialty, qualifications, experience, clinicName, clinicAddress, phone, consultationFee)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        doctorId,
        body.specialty,
        body.qualifications,
        body.experience,
        body.clinicName,
        body.clinicAddress,
        body.phone,
        body.consultationFee || 500,
      ]
    );

    return NextResponse.json({ success: true, doctorId: id }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
