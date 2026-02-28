import { connectDB } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { Doctor } from '@/lib/models/Doctor';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const specialty = searchParams.get('specialty');
    const rating = searchParams.get('minRating');

    const filters: any = { isVerified: true };
    if (specialty) filters.specialty = specialty;
    if (rating) filters.averageRating = { $gte: parseFloat(rating) };

    const doctors = await Doctor.find(filters)
      .select('name specialty qualifications averageRating totalReviews yearsExperience bio clinic')
      .sort({ averageRating: -1 })
      .limit(50);

    return NextResponse.json({ success: true, data: doctors });
  } catch (error) {
    console.error('Doctors fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (auth.role !== 'doctor') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();
    const body = await req.json();
    const { specialty, qualifications, bio, clinic, licenseNumber } = body;

    if (!specialty || !qualifications || !licenseNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      auth.userId,
      {
        specialty,
        qualifications,
        bio,
        clinic,
        licenseNumber,
        isVerified: false,
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: doctor });
  } catch (error) {
    console.error('Doctor profile update error:', error);
    return NextResponse.json({ error: 'Failed to update doctor profile' }, { status: 500 });
  }
}
