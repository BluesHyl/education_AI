import { AIService } from './aiService';

/**
 * 生成沟通回复
 * @param message 用户消息
 * @returns AI回复
 */
export const generateCommunicationResponse = async (message: string): Promise<void> => {
  try {
    // 使用AI服务生成回复
    return await AIService.getInstance().generateCommunicationResponse(message);
  } catch (error) {
    console.error('Error generating communication response:', error);
    throw new Error('Failed to generate communication response');
  }
};


export default {
  generateCommunicationResponse,
};