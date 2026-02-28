import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { createToken } from '@/lib/auth';
import { registerSchema, loginSchema } from '@/lib/validators';
import { NextRequest, NextResponse } from 'next/server';
import { handleError, AppError } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'register') {
      return handleRegister(request);
    } else if (action === 'login') {
      return handleLogin(request);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return handleError(error);
  }
}

async function handleRegister(request: NextRequest) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.errors },
      { status: 400 }
    );
  }

  await connectDB();

  // Check if user already exists
  const existingUser = await User.findOne({ email: parsed.data.email });
  if (existingUser) {
    throw new AppError(400, 'User with this email already exists');
  }

  // Create new user
  const user = new User({
    email: parsed.data.email,
    password: parsed.data.password,
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    role: parsed.data.role,
  });

  await user.save();

  // Create JWT token
  const token = createToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return NextResponse.json(
    {
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    },
    { status: 201 }
  );
}

async function handleLogin(request: NextRequest) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.errors },
      { status: 400 }
    );
  }

  await connectDB();

  const user = await User.findOne({ email: parsed.data.email });
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(parsed.data.password);
  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  // Create JWT token
  const token = createToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return NextResponse.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });
}
