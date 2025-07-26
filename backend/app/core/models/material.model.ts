// app/core/models/material.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  title: string;
  content: string;
  type: string;
  grade: string;
  subject: string;
  author: mongoose.Types.ObjectId;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters long'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    type: {
      type: String,
      enum: ['text', 'quiz', 'exercise', 'video', 'audio', 'other'],
      default: 'text',
    },
    grade: {
      type: String,
      required: [true, 'Please specify the grade level'],
    },
    subject: {
      type: String,
      required: [true, 'Please specify the subject'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide an author'],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
MaterialSchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.model<IMaterial>('Material', MaterialSchema);