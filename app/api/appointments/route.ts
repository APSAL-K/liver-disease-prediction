import { getDb } from '@/lib/db-sqlite';
import { NextRequest, NextResponse } from 'next/server';
import { handleError, AppError } from '@/lib/api';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId, doctorId, appointmentDate, notes } = body;

    if (!patientId || !doctorId || !appointmentDate) {
      throw new AppError(400, 'Missing required fields');
    }

    const db = getDb();

    const appointmentId = crypto.randomUUID();
    const insertAppointment = db.prepare(`
      INSERT INTO appointments (id, patientId, doctorId, appointmentDate, status, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertAppointment.run(appointmentId, patientId, doctorId, appointmentDate, 'pending', notes || '');

    return NextResponse.json({ id: appointmentId, message: 'Appointment booked' }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');
    const status = searchParams.get('status');

    if (!patientId && !doctorId) {
      throw new AppError(400, 'Either patientId or doctorId is required');
    }

    const db = getDb();

    let query = `
      SELECT a.*, 
             p.fullName as patientName, 
             d.specialty, 
             u.fullName as doctorName
      FROM appointments a
      JOIN users p ON a.patientId = p.id
      JOIN doctors d ON a.doctorId = d.id
      JOIN users u ON d.userId = u.id
    `;

    let params: any[] = [];

    if (patientId) {
      query += ' WHERE a.patientId = ?';
      params.push(patientId);
    } else if (doctorId) {
      query += ' WHERE a.doctorId = ?';
      params.push(doctorId);
    }

    if (status) {
      query += patientId || doctorId ? ' AND a.status = ?' : ' WHERE a.status = ?';
      params.push(status);
    }

    query += ' ORDER BY a.appointmentDate DESC';

    const appointments = db.prepare(query).all(...params);

    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, status } = body;

    if (!appointmentId || !status) {
      throw new AppError(400, 'appointmentId and status are required');
    }

    const db = getDb();

    const updateAppointment = db.prepare('UPDATE appointments SET status = ? WHERE id = ?');
    updateAppointment.run(status, appointmentId);

    return NextResponse.json({ message: 'Appointment updated' }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
