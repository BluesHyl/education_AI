import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 处理错误响应
    if (error.response) {
      // 服务器返回错误状态码
      const { status } = error.response;
      
      if (status === 401) {
        // 未授权，清除token并重定向到登录页
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
      
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // 请求已发出但未收到响应
      return Promise.reject({ message: '服务器无响应，请稍后再试' });
    } else {
      // 请求配置出错
      return Promise.reject({ message: '请求配置错误' });
    }
  }
);

// AI提供商配置
let aiProvider = 'openai';
const apiKeys = {
  openai: '',
  'qwen-coder': 'sk-098aef22bedc414c9a491ee38356eb55'
};

// 设置AI提供商
export const setAIProvider = (provider: string) => {
  aiProvider = provider;
  if (provider === 'qwen-coder') {
    api.defaults.headers.common['Authorization'] = `Bearer ${apiKeys['qwen-coder']}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// API服务
const apiService = {
  // 用户认证
  auth: {
    login: (credentials: { email: string; password: string }) => 
      api.post<{ token: string; user: { id: string; name: string; email: string; } }>('/api/users/login', credentials),
    register: (userData: { name: string; email: string; password: string }) => 
      api.post<{ token: string; user: { id: string; name: string; email: string; } }>('/api/users/register', userData),
    logout: () => api.post('/api/users/logout'),
    getProfile: () => api.get<{ user: { id: string; name: string; email: string; } }>('/api/users/me'),
  },
  
  // 批改编辑器
  correction: {
    getDocuments: () => api.get('/correction/documents'),
    getDocument: (id: string) => api.get(`/correction/documents/${id}`),
    createDocument: (document: any) => api.post('/correction/documents', document),
    updateDocument: (id: string, document: any) => api.put(`/correction/documents/${id}`, document),
    deleteDocument: (id: string) => api.delete(`/correction/documents/${id}`),
    analyzeText: (text: string) => api.post('/correction/analyze', { text }),
  },
  
  // 材料生成器
  material: {
    generateMaterial: (params: any) => api.post('/material/generate', params),
    getMaterials: () => api.get('/material/history'),
    getMaterial: (id: string) => api.get(`/material/history/${id}`),
    saveMaterial: (material: any) => api.post('/material/save', material),
    deleteMaterial: (id: string) => api.delete(`/material/history/${id}`),
  },
  
  // 沟通助手
  communication: {
    sendMessage: (message: string) => api.post('/ai/communication', { message }),
    getHistory: () => api.get('/communication/history'),
    clearHistory: () => api.delete('/communication/history'),
    saveConversation: (conversation: any) => api.post('/communication/save', conversation),
  },
};

export default apiService;