import { Router } from 'express';
import { authenticate } from '../core/middleware/auth';
import { Document } from '../models/Document';
import { ApiError } from '../core/middleware/errorHandler';
import { generateCommunicationResponse } from '../services/communicationService';

const router = Router();

// 所有路由需要认证
router.use(authenticate);

// 发送消息并获取AI回复
router.post('/communication', async (req, res, next) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      throw new ApiError('Message is required', 400);
    }
    
    // 调用AI服务生成回复
    const response = await generateCommunicationResponse(message);
    
    res.status(200).json({ 
      status: 'success',
      data: response,
     });
  } catch (error) {
    next(error);
  }
});

// 获取用户的沟通历史
router.get('/history', async (req, res, next) => {
  try {
    const conversations = await Document.findAll({
      where: {
        userId: req.user.id,
        type: 'communication',
      },
      order: [['updatedAt', 'DESC']],
    });
    
    res.status(200).json({ conversations });
  } catch (error) {
    next(error);
  }
});

// 保存沟通记录
router.post('/save', async (req, res, next) => {
  try {
    const { title, messages } = req.body;
    
    if (!title || !messages || !Array.isArray(messages) || messages.length === 0) {
      throw new ApiError('Invalid conversation data', 400);
    }
    
    // 将消息转换为字符串
    const content = JSON.stringify(messages);
    
    const conversation = await Document.create({
      title,
      content,
      userId: req.user.id,
      type: 'communication',
      status: 'saved',
      metadata: {
        messageCount: messages.length,
        lastMessage: new Date().toISOString(),
      },
    });
    
    res.status(201).json({
      message: 'Conversation saved successfully',
      conversation,
    });
  } catch (error) {
    next(error);
  }
});

// 获取单个沟通记录
router.get('/history/:id', async (req, res, next) => {
  try {
    const conversation = await Document.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
        type: 'communication',
      },
    });
    
    if (!conversation) {
      throw new ApiError('Conversation not found', 404);
    }
    
    // 解析消息内容
    let messages = [];
    try {
      messages = JSON.parse(conversation.content);
    } catch (e) {
      console.error('Error parsing conversation content:', e);
    }
    
    res.status(200).json({
      conversation: {
        ...conversation.toJSON(),
        messages,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 删除沟通记录
router.delete('/history/:id', async (req, res, next) => {
  try {
    const conversation = await Document.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
        type: 'communication',
      },
    });
    
    if (!conversation) {
      throw new ApiError('Conversation not found', 404);
    }
    
    await conversation.destroy();
    
    res.status(200).json({
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// 清空所有沟通历史
router.delete('/history', async (req, res, next) => {
  try {
    await Document.destroy({
      where: {
        userId: req.user.id,
        type: 'communication',
      },
    });
    
    res.status(200).json({
      message: 'All conversations cleared successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;