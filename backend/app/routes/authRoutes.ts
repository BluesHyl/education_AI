import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../core/config';
import { authenticate } from '../core/middleware/auth';
import { ApiError } from '../core/middleware/errorHandler';

const router = Router();

// 用户注册
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiError('Email already in use', 400);
    }
    
    // 创建新用户
    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
      isActive: true,
    });
    
    // 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    // 返回用户信息和令牌
    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    next(error);
  }
});

// 用户登录
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // 查找用户
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new ApiError('Invalid email or password', 401);
    }
    
    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError('Invalid email or password', 401);
    }
    
    // 检查用户状态
    if (!user.isActive) {
      throw new ApiError('Account is disabled', 403);
    }
    
    // 更新最后登录时间
    user.lastLogin = new Date();
    await user.save();
    
    // 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    // 返回用户信息和令牌
    res.status(200).json({
      message: 'Login successful',
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    next(error);
  }
});

// 获取当前用户信息
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    res.status(200).json({
      user: req.user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
});

// 更新用户信息
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = req.user;
    
    // 更新用户信息
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    
    await user.save();
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
});

// 修改密码
router.put('/change-password', authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    
    // 验证当前密码
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new ApiError('Current password is incorrect', 400);
    }
    
    // 更新密码
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;