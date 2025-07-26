import { config } from '../config';

/**
 * 验证必要的环境变量是否已配置
 */
export const validateEnv = (): void => {
  const requiredEnvVars = [
    'PORT',
    'JWT_SECRET',
    'MONGODB_URI',
  ];

  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    throw new Error(`缺少必要的环境变量: ${missingVars.join(', ')}`);
  }

  // 验证AI配置（如果启用了AI功能）
  // 验证商业AI服务配置
if (config.ai.apiKey) {
  const requiredAiVars = [
    'AI_API_KEY',
    'AI_MODEL',
  ];

  const missingAiVars = requiredAiVars.filter(envVar => !process.env[envVar]);

  if (missingAiVars.length > 0) {
    throw new Error(`缺少必要的AI环境变量: ${missingAiVars.join(', ')}`);
  }
}

// 验证开源模型配置
if (config.ai.openSourceEndpoint && config.ai.openSourceEndpoint.trim() !== '') {
  const requiredOpenSourceVars = [
    'OPEN_SOURCE_MODEL',
  ];

  const missingOpenSourceVars = requiredOpenSourceVars.filter(envVar => !process.env[envVar]);

  if (missingOpenSourceVars.length > 0) {
    throw new Error(`缺少必要的开源模型环境变量: ${missingOpenSourceVars.join(', ')}`);
  }
};

  console.log('环境变量验证通过');
};
