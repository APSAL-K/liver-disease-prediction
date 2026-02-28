import Stripe from 'stripe';
import { getDb } from '@/lib/db-sqlite';
import { NextRequest, NextResponse } from 'next/server';
import { handleError, AppError } from '@/lib/api';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, amount, userId } = body;

    if (!appointmentId || !amount || !userId) {
      throw new AppError(400, 'Missing required fields');
    }

    const db = getDb();

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: { appointmentId, userId },
    });

    // Create payment record
    const paymentId = crypto.randomUUID();
    const insertPayment = db.prepare(`
      INSERT INTO payments (id, appointmentId, userId, amount, status, stripePaymentId)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertPayment.run(paymentId, appointmentId, userId, amount, 'pending', paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId,
    }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      throw new AppError(400, 'userId is required');
    }

    const db = getDb();

    const payments = db.prepare(`
      SELECT * FROM payments WHERE userId = ? ORDER BY createdAt DESC
    `).all(userId);

    return NextResponse.json({ payments }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, status } = body;

    if (!paymentId || !status) {
      throw new AppError(400, 'paymentId and status are required');
    }

    const db = getDb();

    const updatePayment = db.prepare('UPDATE payments SET status = ? WHERE id = ?');
    updatePayment.run(status, paymentId);

    return NextResponse.json({ message: 'Payment updated' }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
