import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import CorrectionEditor from '../pages/CorrectionEditor';
import MaterialGenerator from '../pages/MaterialGenerator';
import CommunicationAssistant from '../pages/CommunicationAssistant';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import { useUserStore } from '../store';
import React, { useEffect, useState } from 'react';
// 受保护的路由组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isChecking, setIsChecking] = useState(true);
  const user = useUserStore((state) => state.user);
  const getProfile = useUserStore((state) => state.getProfile);
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token && !user) {
        await getProfile();
      }
      setIsChecking(false);
    };
    checkAuth();
  }, [user, getProfile]);

  if (isChecking) {
    return null; // 或显示加载动画
  }

  // 检查本地存储和用户状态
  const isAuthenticated = !!localStorage.getItem('auth_token') || !!user;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// 公共路由组件
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  // 从状态管理中获取用户信息
  const user = useUserStore((state) => state.user);
  
  // 如果用户已登录，重定向到首页
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// 创建路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'correction-editor',
        element: <CorrectionEditor />,
      },
      {
        path: 'material-generator',
        element: <MaterialGenerator />,
      },
      {
        path: 'communication-assistant',
        element: <CommunicationAssistant />,
      },
    ],
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;