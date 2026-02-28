'use server';

import { getDbConnection } from '@/lib/db-mysql';
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { handleError, AppError } from '@/lib/api';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-27.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      throw new AppError(401, 'User ID not found');
    }

    const conn = await getDbConnection();

    // Get appointment and doctor details
    const [appointments] = await conn.execute(
      `SELECT a.*, d.userId as doctorUserId, d.id as doctorId, d.consultationFee
       FROM appointments a
       JOIN doctors d ON a.doctorId = d.id
       WHERE a.id = ? AND a.patientId = ?`,
      [body.appointmentId, userId]
    ) as any;

    if (appointments.length === 0) {
      throw new AppError(404, 'Appointment not found');
    }

    const appointment = appointments[0];
    const amount = Math.round((appointment.consultationFee || 500) * 100);

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        appointmentId: body.appointmentId,
        patientId: userId,
        doctorId: appointment.doctorId,
      },
    });

    const paymentId = crypto.randomUUID();

    // Save payment record
    await conn.execute(
      `INSERT INTO payments (id, appointmentId, userId, doctorId, amount, status, stripePaymentIntentId)
       VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
      [paymentId, body.appointmentId, userId, appointment.doctorId, appointment.consultationFee, paymentIntent.id]
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const conn = await getDbConnection();

    // Update payment status
    await conn.execute(
      `UPDATE payments SET status = ? WHERE stripePaymentIntentId = ?`,
      [body.status, body.stripePaymentIntentId]
    );

    return NextResponse.json({ success: true });
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

    const conn = await getDbConnection();

    const [payments] = await conn.execute(
      `SELECT * FROM payments WHERE userId = ? ORDER BY createdAt DESC LIMIT 20`,
      [userId]
    ) as any;

    return NextResponse.json({ payments });
  } catch (error) {
    return handleError(error);
  }
}
