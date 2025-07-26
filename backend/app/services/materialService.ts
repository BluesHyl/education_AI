import { AIService } from './aiService';
import { config } from '../core/config';
// 材料生成参数接口
interface MaterialGenerationParams {
  type: string;
  subject: string;
  grade: string;
  title: string;
  difficulty: number;
  knowledgePoints: string[];
  requirements?: string;
}

// 材料生成结果接口
interface MaterialGenerationResult {
  content: string;
  metadata?: any;
}

/**
 * 生成教育材料
 * @param params 材料生成参数
 * @returns 生成的材料内容
 */
export const generateMaterial = async (params: MaterialGenerationParams): Promise<MaterialGenerationResult> => {
  try {
    let content: string;
    let aiGenerated = false;

    // 如果AI服务配置有效，则调用AI服务
    if (config.ai.apiKey) {
      try {
        content = await AIService.getInstance().generateMaterial(params);
        aiGenerated = true;
      } catch (error) {
        console.error('AI服务调用失败，回退到模拟数据:', error);
        content = generateMockHandout(params.title, params.subject, params.grade, params.knowledgePoints, params.difficulty);
      }
    } else {
      // 否则直接使用模拟数据
      console.error('AI服务调用失败，回退到模拟数据:', 123);
      content = generateMockHandout(params.title, params.subject, params.grade, params.knowledgePoints, params.difficulty);
    }
    
    return {
      content,
      metadata: {
        ...params,
        aiGenerated,
      },
    };
  } catch (error) {
    console.error('Error generating material:', error);
    throw new Error('Failed to generate material');
  }
};



/**
 * 构建AI提示词
 * @param params 材料生成参数
 * @returns 提示词
 */
const buildPrompt = (params: MaterialGenerationParams): string => {
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
  
  return prompt;
};


/**
 * 生成模拟讲义
 */
const generateMockHandout = (title: string, subject: string, grade: string, knowledgePoints: string[], difficulty: number): string => {
  return `# ${title}

## 课程信息
- 学科：${subject}
- 年级：${grade}
- 难度：${difficulty}/5

## 知识点概述

本讲义涵盖以下核心知识点：
${knowledgePoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}

## 第一部分：${knowledgePoints[0] || '知识点1'}

### 1.1 基本概念

${knowledgePoints[0] || '知识点1'}是指...（概念解释）

### 1.2 重要性质

1. 性质一：...
2. 性质二：...
3. 性质三：...

### 1.3 应用示例

示例1：...
示例2：...

## 第二部分：${knowledgePoints[1] || '知识点2'}

### 2.1 基本概念

${knowledgePoints[1] || '知识点2'}是指...（概念解释）

### 2.2 重要性质

1. 性质一：...
2. 性质二：...
3. 性质三：...

### 2.3 应用示例

示例1：...
示例2：...

## 第三部分：知识点关联与拓展

### 3.1 知识点之间的联系

${knowledgePoints[0] || '知识点1'}与${knowledgePoints[1] || '知识点2'}的关系...

### 3.2 拓展阅读

1. 拓展主题一：...
2. 拓展主题二：...

## 第四部分：典型例题分析

### 例题1

问题：...
解析：...
答案：...

### 例题2

问题：...
解析：...
答案：...

## 第五部分：思考题

1. 思考题一：...
2. 思考题二：...
3. 思考题三：...

## 参考资料

1. 参考资料一
2. 参考资料二
3. 参考资料三

注：本讲义为模拟生成，实际使用时请根据教学需求进行调整。`;
};

export default {
  generateMaterial,
};