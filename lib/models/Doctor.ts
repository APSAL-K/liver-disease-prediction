import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      enum: ['Hepatologist', 'General Practitioner', 'Gastroenterologist'],
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    about: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    availability: [
      {
        dayOfWeek: {
          type: Number, // 0-6 (Sunday-Saturday)
          required: true,
        },
        startTime: String, // HH:MM format
        endTime: String,
      },
    ],
  },
  { timestamps: true }
);

export const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
