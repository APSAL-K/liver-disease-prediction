import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-12345';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
}

export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Password hashing functions
export const hashPassword = (password: string): Promise<string> => {
  const salt = bcryptjs.genSaltSync(10);
  return Promise.resolve(bcryptjs.hashSync(password, salt));
};

export const comparePassword = (password: string, hashedPassword: string): Promise<boolean> => {
  return Promise.resolve(bcryptjs.compareSync(password, hashedPassword));
};

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

export function withAuth(handler: Function) {
  return async (request: NextRequest) => {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Attach user to request
    (request as any).user = payload;
    return handler(request);
  };
}
