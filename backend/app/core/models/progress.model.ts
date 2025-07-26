// app/core/models/progress.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProgress extends Document {
  user: mongoose.Types.ObjectId;
  material: mongoose.Types.ObjectId;
  status: string;
  score?: number;
  feedback?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user'],
    },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material',
      required: [true, 'Please provide a material'],
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    feedback: {
      type: String,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only have one progress record per material
ProgressSchema.index({ user: 1, material: 1 }, { unique: true });

export default mongoose.model<IProgress>('Progress', ProgressSchema);