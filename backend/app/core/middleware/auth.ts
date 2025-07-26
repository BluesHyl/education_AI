import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiError } from './errorHandler';
import { User } from '../models';

// 扩展Request类型以包含用户信息
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// 认证中间件
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Authentication required', 401);
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ApiError('Invalid token format', 401);
    }
    
    // 验证token
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as any;
      
      // 查找用户
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new ApiError('User not found', 401);
      }
      
      // 将用户信息添加到请求对象
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new ApiError('Invalid token', 401);
      } else if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError('Token expired', 401);
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

// 角色验证中间件
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError('Authentication required', 401);
      }
      
      if (!roles.includes(req.user.role)) {
        throw new ApiError('Insufficient permissions', 403);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};