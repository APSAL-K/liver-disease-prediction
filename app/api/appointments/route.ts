import { connectDB } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { Appointment } from '@/lib/models/Appointment';
import { Doctor } from '@/lib/models/Doctor';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');

    const filters: any = {};
    if (auth.role === 'patient') {
      filters.patientId = auth.userId;
    } else if (auth.role === 'doctor') {
      filters.doctorId = auth.userId;
    }
    if (doctorId) filters.doctorId = doctorId;

    const appointments = await Appointment.find(filters)
      .populate('doctorId', 'name specialty clinic')
      .populate('patientId', 'name email phone')
      .sort({ appointmentDate: 1 });

    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    console.error('Appointments fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'patient') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { doctorId, appointmentDate, appointmentTime, reason, notes } = body;

    if (!doctorId || !appointmentDate || !appointmentTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Check for conflicts
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate,
      appointmentTime,
      status: { $in: ['scheduled', 'confirmed'] },
    });

    if (existingAppointment) {
      return NextResponse.json({ error: 'Time slot already booked' }, { status: 409 });
    }

    const appointment = await Appointment.create({
      patientId: auth.userId,
      doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      reason,
      notes,
      status: 'scheduled',
      createdAt: new Date(),
    });

    await appointment.populate('doctorId', 'name specialty clinic');

    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (error) {
    console.error('Appointment creation error:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const { appointmentId, status } = body;

    if (!appointmentId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Only doctor or patient can modify their appointment
    const isAuthorized = auth.userId === appointment.doctorId.toString() || 
                        auth.userId === appointment.patientId.toString();
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    appointment.status = status;
    await appointment.save();

    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    console.error('Appointment update error:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}
