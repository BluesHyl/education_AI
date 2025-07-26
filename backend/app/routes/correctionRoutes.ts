import { Router } from 'express';
import { authenticate } from '../core/middleware/auth';
import { Document } from '../models/Document';
import { Correction } from '../models/Correction';
import { ApiError } from '../core/middleware/errorHandler';
import { analyzeText } from '../services/correctionService';

const router = Router();

// 所有路由需要认证
router.use(authenticate);

// 获取用户的所有批改文档
router.get('/documents', async (req, res, next) => {
  try {
    const documents = await Document.findAll({
      where: {
        userId: req.user.id,
        type: 'correction',
      },
      order: [['updatedAt', 'DESC']],
    });
    
    res.status(200).json({ documents });
  } catch (error) {
    next(error);
  }
});

// 获取单个批改文档及其批改项
router.get('/documents/:id', async (req, res, next) => {
  try {
    const document = await Document.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
        type: 'correction',
      },
      include: [
        {
          model: Correction,
          as: 'corrections',
        },
      ],
    });
    
    if (!document) {
      throw new ApiError('Document not found', 404);
    }
    
    res.status(200).json({ document });
  } catch (error) {
    next(error);
  }
});

// 创建新的批改文档
router.post('/documents', async (req, res, next) => {
  try {
    const { title, content } = req.body;
    
    const document = await Document.create({
      title,
      content,
      userId: req.user.id,
      type: 'correction',
      status: 'draft',
    });
    
    res.status(201).json({
      message: 'Document created successfully',
      document,
    });
  } catch (error) {
    next(error);
  }
});

// 更新批改文档
router.put('/documents/:id', async (req, res, next) => {
  try {
    const { title, content, status } = req.body;
    
    const document = await Document.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
        type: 'correction',
      },
    });
    
    if (!document) {
      throw new ApiError('Document not found', 404);
    }
    
    // 更新文档
    if (title !== undefined) document.title = title;
    if (content !== undefined) document.content = content;
    if (status !== undefined) document.status = status;
    
    await document.save();
    
    res.status(200).json({
      message: 'Document updated successfully',
      document,
    });
  } catch (error) {
    next(error);
  }
});

// 删除批改文档
router.delete('/documents/:id', async (req, res, next) => {
  try {
    const document = await Document.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
        type: 'correction',
      },
    });
    
    if (!document) {
      throw new ApiError('Document not found', 404);
    }
    
    // 删除文档及其关联的批改项
    await document.destroy();
    
    res.status(200).json({
      message: 'Document deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// 创建批改项
router.post('/documents/:id/corrections', async (req, res, next) => {
  try {
    const { type, position, comment, suggestion } = req.body;
    
    const document = await Document.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
        type: 'correction',
      },
    });
    
    if (!document) {
      throw new ApiError('Document not found', 404);
    }
    
    const correction = await Correction.create({
      documentId: document.id,
      type,
      position,
      comment,
      suggestion,
      applied: false,
    });
    
    res.status(201).json({
      message: 'Correction created successfully',
      correction,
    });
  } catch (error) {
    next(error);
  }
});

// 更新批改项
router.put('/documents/:documentId/corrections/:id', async (req, res, next) => {
  try {
    const { type, position, comment, suggestion, applied } = req.body;
    
    // 验证文档所有权
    const document = await Document.findOne({
      where: {
        id: req.params.documentId,
        userId: req.user.id,
        type: 'correction',
      },
    });
    
    if (!document) {
      throw new ApiError('Document not found', 404);
    }
    
    // 查找批改项
    const correction = await Correction.findOne({
      where: {
        id: req.params.id,
        documentId: document.id,
      },
    });
    
    if (!correction) {
      throw new ApiError('Correction not found', 404);
    }
    
    // 更新批改项
    if (type !== undefined) correction.type = type;
    if (position !== undefined) correction.position = position;
    if (comment !== undefined) correction.comment = comment;
    if (suggestion !== undefined) correction.suggestion = suggestion;
    if (applied !== undefined) correction.applied = applied;
    
    await correction.save();
    
    res.status(200).json({
      message: 'Correction updated successfully',
      correction,
    });
  } catch (error) {
    next(error);
  }
});

// 删除批改项
router.delete('/documents/:documentId/corrections/:id', async (req, res, next) => {
  try {
    // 验证文档所有权
    const document = await Document.findOne({
      where: {
        id: req.params.documentId,
        userId: req.user.id,
        type: 'correction',
      },
    });
    
    if (!document) {
      throw new ApiError('Document not found', 404);
    }
    
    // 查找批改项
    const correction = await Correction.findOne({
      where: {
        id: req.params.id,
        documentId: document.id,
      },
    });
    
    if (!correction) {
      throw new ApiError('Correction not found', 404);
    }
    
    // 删除批改项
    await correction.destroy();
    
    res.status(200).json({
      message: 'Correction deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// AI分析文本
router.post('/analyze', async (req, res, next) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      throw new ApiError('Text is required', 400);
    }
    
    // 调用AI服务分析文本
    const corrections = await analyzeText(text);
    
    res.status(200).json({
      corrections,
    });
  } catch (error) {
    next(error);
  }
});

export default router;