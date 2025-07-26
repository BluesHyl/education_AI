import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// 用户模型接口
interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
  lastLogin?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// 用户模型 Schema
const UserSchema = new mongoose.Schema<UserAttributes>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Invalid email format',
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
  },
  avatar: {
    type: String,
  },
  lastLogin: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
}, {
  timestamps: true,
});

// 密码哈希钩子
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// 密码比较方法
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 转换为JSON时排除敏感字段
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// 用户模型
export const User = mongoose.models.User || mongoose.model<UserAttributes>('User', UserSchema);