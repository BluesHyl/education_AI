import { config } from '../core/config';
import OpenAI from 'openai';
import { exponentialBackoff } from '../utils/retry';

type AIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export class AIService {
  private static instance: AIService;
  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * 调用AI服务生成内容
   * @param messages 消息数组
   * @param options 可选参数
   * @returns AI生成的内容
   */
  public async generateContent(
    messages: AIMessage[],
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<string> {
    try {
      // 初始化OpenAI客户端
      const openai = new OpenAI({
        apiKey: config.ai.apiKey,
        baseURL: config.ai.endpoint,
      });

      const response = await exponentialBackoff(
        async () => {
          const completion = await openai.chat.completions.create({
            model: options?.model || config.ai.model,
            messages,
            temperature: options?.temperature || config.ai.temperature,
            max_tokens: options?.maxTokens || config.ai.maxTokens,
          });
          return completion;
        },
        config.ai.maxRetries
      );

      if (!response.choices || response.choices.length === 0) {
        throw new Error('AI response is empty or invalid');
      }
      console.log('AI Response:', response.choices[0].message.content);
      return response.choices[0].message.content!;
    } catch (error) {
      console.error('AI API Error:', error);
      throw new Error('Failed to generate content with AI');
    }
  }

  /**
   * 生成沟通回复
   * @param message 用户消息
   * @returns AI回复
   */
  public async generateCommunicationResponse(
    message: string
  ): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content:
          '你是一位专业的教育沟通顾问，擅长为教师提供与学生、家长和同事有效沟通的策略和建议。',
      },
      {
        role: 'user',
        content: `作为一名专业的教育沟通助手，请针对以下教育场景或问题提供专业、有效的沟通建议：\n\n用户问题：${message}\n\n请提供具体、实用的沟通策略、话术建议或解决方案，帮助教师更好地处理这个沟通场景。回答应该包含：\n1. 对情况的简要分析\n2. 具体的沟通策略和建议\n3. 可以直接使用的示例话术（如适用）\n4. 需要注意的沟通技巧或禁忌\n\n请确保回答专业、有建设性，并基于教育心理学和有效沟通的原则。`,
      },
    ];

    try {
      const openai = new OpenAI({
        apiKey: config.ai.apiKey,
        baseURL: config.ai.endpoint,
      });

      const response = await exponentialBackoff(
        async () => {
          const completion = await openai.chat.completions.create({
            model: config.ai.model,
            messages,
            temperature: 0.7,
            max_tokens: 2000,
          });
          return completion;
        },
        config.ai.maxRetries
      );

      if (!response.choices || response.choices.length === 0) {
        throw new Error('AI response is empty or invalid');
      }
      return response.choices[0].message.content!;
    } catch (error) {
      console.error('AI API Error:', error);
      throw new Error('Failed to generate communication response with AI');
    }
  }

  /**
   * 分析文本并提供批改建议
   * @param text 需要分析的文本
   * @returns 批改结果
   */
  public async analyzeText(text: string): Promise<any> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content:
          '你是一位专业的文本校对专家，擅长发现文本中的语法错误、拼写错误和表达不当之处。',
      },
      {
        role: 'user',
        content: `请分析以下文本，找出其中的语法错误、拼写错误和表达不当之处，并提供修改建议。\n\n文本内容：\n"""\n${text}\n"""\n\n请按照以下JSON格式返回分析结果：\n[\n  {\n    "type": "grammar|spelling|expression",\n    "severity": "error|warning|suggestion",\n    "position": {\n      "start": 0,\n      "end": 0\n    },\n    "comment": "错误描述",\n    "suggestion": "修改建议"\n  }\n]\n\n注意：\n1. position.start和position.end表示错误在原文中的字符位置（从0开始计数）\n2. type表示错误类型：grammar（语法错误）、spelling（拼写错误）或expression（表达不当）\n3. severity表示严重程度：error（错误）、warning（警告）或suggestion（建议）\n4. 只返回JSON数组，不要有其他文字说明`,
      },
    ];

    const result = await this.generateContent(messages, {
      temperature: 0.3,
    });

    try {
      return JSON.parse(result);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Failed to parse AI response');
    }
  }

  /**
   * 生成教育材料
   * @param params 材料生成参数
   * @returns 生成的材料内容
   */
  public async generateMaterial(params: {
    type: string;
    subject: string;
    grade: string;
    title: string;
    difficulty: number;
    knowledgePoints: string[];
    requirements?: string;
  }): Promise<string> {
    const { type, subject, grade, title, difficulty, knowledgePoints, requirements } = params;

    // 将学科和年级转换为中文
    const subjectMap: Record<string, string> = {
      chinese: '语文',
      math: '数学',
      english: '英语',
      physics: '物理',
      chemistry: '化学',
      biology: '生物',
      history: '历史',
      geography: '地理',
      politics: '政治',
    };

    const gradeMap: Record<string, string> = {
      primary1: '小学一年级',
      primary2: '小学二年级',
      primary3: '小学三年级',
      primary4: '小学四年级',
      primary5: '小学五年级',
      primary6: '小学六年级',
      junior1: '初中一年级',
      junior2: '初中二年级',
      junior3: '初中三年级',
      senior1: '高中一年级',
      senior2: '高中二年级',
      senior3: '高中三年级',
    };

    const typeMap: Record<string, string> = {
      lesson: '教案',
      exercise: '练习题',
      exam: '测验',
      handout: '讲义',
    };

    const subjectCn = subjectMap[subject] || subject;
    const gradeCn = gradeMap[grade] || grade;
    const typeCn = typeMap[type] || type;

    // 构建提示词
    let prompt = `请为${gradeCn}${subjectCn}课程创建一份${typeCn}，标题为"${title}"。\n\n`;

    // 添加知识点
    prompt += `需要包含的知识点：\n`;
    knowledgePoints.forEach((point, index) => {
      prompt += `${index + 1}. ${point}\n`;
    });

    // 添加难度
    prompt += `\n难度级别：${difficulty}/5（1为最简单，5为最难）\n`;

    // 添加特殊要求
    if (requirements) {
      prompt += `\n特殊要求：\n${requirements}\n`;
    }

    // 根据材料类型添加特定指导
    switch (type) {
      case 'lesson':
        prompt += `\n请创建一个完整的教案，包括教学目标、教学重点难点、教学过程（导入、新课讲授、巩固练习、总结）、板书设计和课后反思。`;
        break;
      case 'exercise':
        prompt += `\n请创建一套练习题，包括选择题、填空题和解答题，并提供答案和解析。`;
        break;
      case 'exam':
        prompt += `\n请创建一份测验，包括选择题、填空题和解答题，并提供答案和评分标准。`;
        break;
      case 'handout':
        prompt += `\n请创建一份讲义，包括知识点概述、重要概念解释、例题分析和思考题。`;
        break;
    }

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: '你是一位专业的教育内容创作者，擅长根据教学需求生成高质量的教育材料。',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.generateContent(messages, {
      temperature: 0.7,
      maxTokens: 2000,
    });
  }
}