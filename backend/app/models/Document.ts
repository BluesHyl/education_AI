import mongoose from 'mongoose';
import { User } from './User';

// 批改文档模型接口
interface DocumentAttributes {
  title: string;
  content: string;
  userId: string;
  type: string;
  status: string;
  metadata?: any;
}

// 批改文档 Schema
const DocumentSchema = new mongoose.Schema<DocumentAttributes>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
    default: 'correction', // correction, material, communication
  },
  status: {
    type: String,
    required: true,
    default: 'draft', // draft, published, archived
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

// 批改文档模型
export const Document = mongoose.models.Document || mongoose.model<DocumentAttributes>('Document', DocumentSchema);