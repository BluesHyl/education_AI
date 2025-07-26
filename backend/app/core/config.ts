// app/core/config.ts
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/education_ai',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'qwen3',
    apiKey: process.env.AI_API_KEY || '',
    endpoint: process.env.AI_ENDPOINT || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: process.env.AI_MODEL || 'qwen-plus',
    timeout: parseInt(process.env.AI_TIMEOUT || '30000'),
    maxRetries: parseInt(process.env.AI_MAX_RETRIES || '3'),
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '2000'),
    // 开源模型配置
    openSourceEndpoint: process.env.OPEN_SOURCE_ENDPOINT || 'http://localhost:8000',
    openSourceModel: process.env.OPEN_SOURCE_MODEL || 'qwen-coder'
  }
};