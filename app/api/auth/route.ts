import { getDbConnection } from '@/lib/db-mysql';
import { createToken, hashPassword, comparePassword } from '@/lib/auth';
import { registerSchema, loginSchema } from '@/lib/validators';
import { NextRequest, NextResponse } from 'next/server';
import { handleError, AppError } from '@/lib/api';
import crypto from 'crypto';

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

  try {
    const conn = await getDbConnection();

    // Check if user already exists
    const [existingUsers] = await conn.execute(
      'SELECT id FROM users WHERE email = ?',
      [parsed.data.email]
    ) as any;

    if (existingUsers.length > 0) {
      throw new AppError(400, 'User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(parsed.data.password);
    const userId = crypto.randomUUID();

    // Create new user
    await conn.execute(
      'INSERT INTO users (id, email, password, fullName, role) VALUES (?, ?, ?, ?, ?)',
      [
        userId,
        parsed.data.email,
        hashedPassword,
        `${parsed.data.firstName} ${parsed.data.lastName}`,
        parsed.data.role,
      ]
    );

    // Create JWT token
    const token = createToken({
      userId,
      email: parsed.data.email,
      role: parsed.data.role,
    });

    return NextResponse.json(
      {
        token,
        user: {
          id: userId,
          email: parsed.data.email,
          fullName: `${parsed.data.firstName} ${parsed.data.lastName}`,
          role: parsed.data.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
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

  try {
    const conn = await getDbConnection();

    const [users] = await conn.execute(
      'SELECT * FROM users WHERE email = ?',
      [parsed.data.email]
    ) as any;

    if (users.length === 0) {
      throw new AppError(401, 'Invalid email or password');
    }

    const user = users[0];
    const isPasswordValid = await comparePassword(parsed.data.password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Create JWT token
    const token = createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
