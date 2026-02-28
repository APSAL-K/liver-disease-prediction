'use server';

import { getDbConnection } from '@/lib/db-mysql';
import { NextRequest, NextResponse } from 'next/server';
import { handleError, AppError } from '@/lib/api';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const patientId = request.headers.get('x-user-id');

    if (!patientId) {
      throw new AppError(401, 'User ID not found');
    }

    const conn = await getDbConnection();

    const appointmentId = crypto.randomUUID();

    await conn.execute(
      `INSERT INTO appointments (id, patientId, doctorId, appointmentDate, status)
       VALUES (?, ?, ?, ?, 'scheduled')`,
      [appointmentId, patientId, body.doctorId, body.appointmentDate]
    );

    return NextResponse.json({ success: true, appointmentId }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const role = request.headers.get('x-user-role');

    if (!userId) {
      throw new AppError(401, 'User ID not found');
    }

    const conn = await getDbConnection();

    let appointments;

    if (role === 'patient') {
      const [result] = await conn.execute(
        `SELECT a.*, d.*, u.fullName 
         FROM appointments a
         JOIN doctors d ON a.doctorId = d.id
         JOIN users u ON d.userId = u.id
         WHERE a.patientId = ?
         ORDER BY a.appointmentDate DESC`,
        [userId]
      ) as any;
      appointments = result;
    } else if (role === 'doctor') {
      const [result] = await conn.execute(
        `SELECT a.*, u.fullName, u.email
         FROM appointments a
         JOIN doctors d ON a.doctorId = d.id
         JOIN users u ON a.patientId = u.id
         WHERE d.userId = ?
         ORDER BY a.appointmentDate DESC`,
        [userId]
      ) as any;
      appointments = result;
    }

    return NextResponse.json({ appointments });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const conn = await getDbConnection();

    await conn.execute(
      `UPDATE appointments SET status = ? WHERE id = ?`,
      [body.status, body.appointmentId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
