import { connectDB } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { Payment } from '@/lib/models/Payment';
import { Appointment } from '@/lib/models/Appointment';
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const { appointmentId, amount } = body;

    if (!appointmentId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        appointmentId: appointmentId,
        patientId: auth.userId,
        doctorId: appointment.doctorId.toString(),
      },
    });

    // Save payment record
    const payment = await Payment.create({
      appointmentId,
      patientId: auth.userId,
      doctorId: appointment.doctorId,
      amount,
      stripePaymentIntentId: paymentIntent.id,
      status: 'pending',
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const { paymentId, status } = body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    payment.status = status;
    if (status === 'completed') {
      payment.completedAt = new Date();
      // Update appointment status
      await Appointment.findByIdAndUpdate(payment.appointmentId, { status: 'confirmed' });
    }
    await payment.save();

    return NextResponse.json({ success: true, data: payment });
  } catch (error) {
    console.error('Payment update error:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get('appointmentId');

    const filters: any = {};
    if (auth.role === 'patient') {
      filters.patientId = auth.userId;
    } else if (auth.role === 'doctor') {
      filters.doctorId = auth.userId;
    }
    if (appointmentId) filters.appointmentId = appointmentId;

    const payments = await Payment.find(filters).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: payments });
  } catch (error) {
    console.error('Payments fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
