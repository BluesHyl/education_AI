import { AIService } from './aiService';

// 批改结果接口
interface CorrectionResult {
  id: string;
  type: string; // grammar, spelling, expression
  severity: string; // error, warning, suggestion
  position: {
    start: number;
    end: number;
  };
  comment: string;
  suggestion?: string;
}

/**
 * 分析文本并提供批改建议
 * @param text 需要分析的文本
 * @returns 批改结果数组
 */
export const analyzeText = async (text: string): Promise<CorrectionResult[]> => {
  try {
    // 使用AI服务分析文本
    const corrections = await AIService.getInstance().analyzeText(text);
    
    // 添加唯一ID
    return corrections.map((correction: any, index: number) => ({
      ...correction,
      id: `ai-correction-${Date.now()}-${index}`,
    }));
  } catch (error) {
    console.error('Error analyzing text:', error);
    throw new Error('Failed to analyze text');
  }
};





export default {
  analyzeText,
};