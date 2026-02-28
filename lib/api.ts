import { NextResponse } from 'next/server';

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: any) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }

  console.error('Unexpected error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

export async function successResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}
