import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['patient', 'doctor'], { errorMap: () => ({ message: 'Role must be patient or doctor' }) }),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const healthAssessmentSchema = z.object({
  age: z.number().min(0).max(150),
  gender: z.enum(['male', 'female', 'other']),
  totalBilirubin: z.number().positive(),
  directBilirubin: z.number().positive(),
  alkalinePhosphatase: z.number().positive(),
  sgpt: z.number().positive(),
  sgot: z.number().positive(),
  totalProteins: z.number().positive(),
  albumin: z.number().positive(),
  albuminGlobulinRatio: z.number().positive(),
});

export const appointmentBookingSchema = z.object({
  doctorId: z.string().min(1),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  notes: z.string().optional(),
});

export const doctorProfileSchema = z.object({
  specialization: z.string().min(1),
  experience: z.number().min(0),
  consultationFee: z.number().positive(),
  about: z.string().min(10),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type HealthAssessmentInput = z.infer<typeof healthAssessmentSchema>;
export type AppointmentBookingInput = z.infer<typeof appointmentBookingSchema>;
export type DoctorProfileInput = z.infer<typeof doctorProfileSchema>;
