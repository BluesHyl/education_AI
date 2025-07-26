// app/core/routes.ts
import { Express } from 'express';
import { setupRoutes as setupAppRoutes } from './routes/index';

export const setupRoutes = (app: Express) => {
  // 将路由设置委托给routes/index.ts
  setupAppRoutes(app);
};