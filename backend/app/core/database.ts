// app/core/database.ts
import mongoose from 'mongoose';
import { config } from './config';

// 初始化数据库连接
export const setupDatabase = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('MongoDB connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default mongoose;