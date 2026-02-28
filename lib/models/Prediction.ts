import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    medicalMetrics: {
      age: Number,
      gender: String,
      totalBilirubin: Number,
      directBilirubin: Number,
      alkalinePhosphatase: Number,
      sgpt: Number,
      sgot: Number,
      totalProteins: Number,
      albumin: Number,
      albuminGlobulinRatio: Number,
    },
    riskLevel: {
      type: String,
      enum: ['None', 'Low', 'Medium', 'High'],
      required: true,
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    recommendations: [String],
  },
  { timestamps: true }
);

export const Prediction = mongoose.models.Prediction || mongoose.model('Prediction', predictionSchema);
