import { Router } from 'express';
import { authenticate } from '../core/middleware/auth';
import { Document } from '../models/Document';
import { ApiError } from '../core/middleware/errorHandler';
import { generateMaterial } from '../services/materialService';

const router = Router();

// 所有路由需要认证
router.use(authenticate);

// 生成教育材料
router.post('/generate', async (req, res, next) => {
  console.log('Generating material...');
  try {
    const { type, subject, grade, title, difficulty, knowledgePoints, requirements } = req.body;
    
    // 验证必要参数
    if (!type || !subject || !grade || !title || !knowledgePoints || !Array.isArray(knowledgePoints)) {
      throw new ApiError('Missing required parameters', 400);
    }
    
    // 调用AI服务生成材料
    const result = await generateMaterial({
      type,
      subject,
      grade,
      title,
      difficulty: difficulty || 3,
      knowledgePoints,
      requirements: requirements || '',
    });
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// 获取用户的所有材料
router.get('/history', async (req, res, next) => {
  try {
    const materials = await Document.find({
      userId: req.user.id,
      type: 'material',
    }).sort({ updatedAt: -1 });
    
    res.status(200).json({ materials });
  } catch (error) {
    next(error);
  }
});

// 获取单个材料
router.get('/history/:id', async (req, res, next) => {
  try {
    const material = await Document.findOne({
      _id: req.params.id,
      userId: req.user.id,
      type: 'material',
    });
    
    if (!material) {
      throw new ApiError('Material not found', 404);
    }
    
    res.status(200).json({ material });
  } catch (error) {
    next(error);
  }
});

// 保存生成的材料
router.post('/save', async (req, res, next) => {
  try {
    const { type, subject, grade, title, content, metadata } = req.body;
    
    // 验证必要参数
    if (!type || !subject || !grade || !title || !content) {
      throw new ApiError('Missing required parameters', 400);
    }
    
    const material = new Document({
      title,
      content,
      userId: req.user.id,
      type: 'material',
      status: 'published',
      metadata: {
        subject,
        grade,
        materialType: type,
        ...metadata,
      },
    });
    await material.save();
    
    res.status(201).json({
      message: 'Material saved successfully',
      material,
    });
  } catch (error) {
    next(error);
  }
});

// 删除材料
router.delete('/history/:id', async (req, res, next) => {
  try {
    const material = await Document.findOne({
      _id: req.params.id,
      userId: req.user.id,
      type: 'material',
    });
    
    if (!material) {
      throw new ApiError('Material not found', 404);
    }
    
    await material.destroy();
    
    res.status(200).json({
      message: 'Material deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;