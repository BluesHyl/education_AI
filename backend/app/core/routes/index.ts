// app/core/routes/index.ts
import { Express } from 'express';
import userRoutes from './user.routes';
import materialRoutes from '../../routes/materialRoutes';
import chatRoutes from '../../routes/chatRoutes';
import communicationRoutes from '../../routes/communicationRoutes';

export const setupRoutes = (app: Express) => {
  // 健康检查路由
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API版本路由
  app.get('/api/version', (req, res) => {
    res.status(200).json({ version: '1.0.0' });
  });

  // 用户相关路由
  app.use('/', userRoutes);

  // 添加其他API路由
  app.use('/material', materialRoutes);
  app.use('/v1/chat', chatRoutes);
  app.use('/ai', communicationRoutes);
};