import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { config } from './app/core/config';
import { setupRoutes } from './app/core/routes';
import { setupDatabase } from './app/core/database';
import { errorHandler } from './app/core/middleware/errorHandler';
import { validateEnv } from './app/core/utils/envValidator';

// 创建Express应用
const app = express();
const httpServer = createServer(app);

// 中间件配置
app.use(helmet()); // 安全HTTP头
app.use(compression()); // 响应压缩
app.use(cors()); // 跨域资源共享
app.use(morgan('dev')); // 请求日志
app.use(express.json()); // JSON解析
app.use(express.urlencoded({ extended: true })); // URL编码解析

// 验证环境变量
validateEnv();

// 设置数据库连接
setupDatabase();

// 设置API路由
setupRoutes(app);

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const PORT = config.port || 8000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // 在生产环境中，可能需要通知管理员并优雅地重启服务
});

// 处理未处理的Promise拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // 在生产环境中，可能需要通知管理员
});

export default app;