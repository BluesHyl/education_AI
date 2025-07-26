import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import apiService from '../services/api';
import { useNavigate } from 'react-router'
// 用户状态接口
interface UserState {
  user: { id: string; name: string; email: string; } | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
  clearError: () => void;
}

// 批改状态接口
interface CorrectionState {
  document: { id: string; title: string; content: string; corrections: Array<{ id: string; text: string; }>; } | null;
  documents: any[];
  corrections: any[];
  isLoading: boolean;
  error: string | null;
  getDocuments: () => Promise<void>;
  getDocument: (id: string) => Promise<void>;
  createDocument: (document: any) => Promise<void>;
  updateDocument: (id: string, document: any) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  analyzeText: (text: string) => Promise<void>;
  saveDocument: (document: any) => Promise<void>;
  clearError: () => void;
}

// 材料状态接口
interface MaterialState {
  materials: Array<{ id: string; title: string; content: string; }>;
  currentMaterial: any | null;
  isLoading: boolean;
  error: string | null;
  generateMaterial: (params: any) => Promise<any>;
  getMaterials: () => Promise<void>;
  getMaterial: (id: string) => Promise<void>;
  saveMaterial: (material: any) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
  clearError: () => void;
}

// 沟通状态接口
interface CommunicationState {
  messages: Array<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: number; }>;
  conversations: Array<{ id: string; title: string; messages: Array<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: number; }>; }>;
  isLoading: boolean;
  error: string | null;
  addMessage: (message: any) => void;
  sendMessage: (message: string) => Promise<void>;
  getConversations: () => Promise<void>;
  saveConversation: (title: string) => Promise<void>;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// 创建用户状态
export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.auth.login(credentials);
      console.log(response);
      localStorage.setItem('auth_token', response.data.token);
      set({ user: response.data.user, isLoading: false });
      const navigate = useNavigate();
      // 登录成功后可以重定向到主页或其他页面
      navigate('/'); // 使用浏览器的导航功能
    } catch (error: any) {
      set({ 
        error: error.message || '登录失败，请检查您的凭据', 
        isLoading: false 
      });
    }
  },
  
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response: { token: string; user: { id: string; name: string; email: string; } } = await apiService.auth.register(userData);
      localStorage.setItem('auth_token', response.token);
      set({ user: response.user, isLoading: false });
      window.location.href = '/login';
    } catch (error: any) {
      set({ 
        error: error.message || '注册失败，请稍后再试', 
        isLoading: false 
      });
    }
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
    set({ user: null });
  },
  
  getProfile: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    
    set({ isLoading: true, error: null });
    try {
      const response: { user: { id: string; name: string; email: string; } } = await apiService.auth.getProfile();
      set({ user: response.user, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || '获取用户信息失败', 
        isLoading: false 
      });
      // 如果是认证错误，清除token
      if (error.status === 401) {
        localStorage.removeItem('auth_token');
        set({ user: null });
      }
    }
  },
  
  clearError: () => set({ error: null }),
}));

// 创建批改状态
export const useCorrectionStore = create<CorrectionState>((set, get) => ({
  document: null,
  documents: [],
  corrections: [],
  isLoading: false,
  error: null,
  
  getDocuments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response: { documents: Array<{ id: string; title: string; content: string; corrections: Array<{ id: string; text: string; }>; }> } = await apiService.correction.getDocuments();
      set({ documents: response.documents, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || '获取文档列表失败', 
        isLoading: false 
      });
    }
  },
  
  getDocument: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response: { document: { id: string; title: string; content: string; corrections: Array<{ id: string; text: string; }>; } } = await apiService.correction.getDocument(id);
      set({ 
        document: response.document, 
        corrections: response.document.corrections || [],
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || '获取文档失败', 
        isLoading: false 
      });
    }
  },
  
  createDocument: async (document) => {
    set({ isLoading: true, error: null });
    try {
      const response: { document: { id: string; title: string; content: string; corrections: Array<{ id: string; text: string; }>; } } = await apiService.correction.createDocument(document);
      set({ 
        document: response.document, 
        documents: [response.document, ...get().documents],
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || '创建文档失败', 
        isLoading: false 
      });
    }
  },
  
  updateDocument: async (id, document) => {
    set({ isLoading: true, error: null });
    try {
      const response: { document: { id: string; title: string; content: string; corrections: Array<{ id: string; text: string; }>; } } = await apiService.correction.updateDocument(id, document);
      set({ 
        document: response.document,
        documents: get().documents.map(doc => 
          doc.id === id ? response.document : doc
        ),
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || '更新文档失败', 
        isLoading: false 
      });
    }
  },
  
  deleteDocument: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.correction.deleteDocument(id);
      set({ 
        documents: get().documents.filter(doc => doc.id !== id),
        document: get().document?.id === id ? null : get().document,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || '删除文档失败', 
        isLoading: false 
      });
    }
  },
  
  analyzeText: async (text) => {
    set({ isLoading: true, error: null });
    try {
      const response: { corrections: Array<{ id: string; text: string; }> } = await apiService.correction.analyzeText(text);
      set({ corrections: response.corrections, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || '分析文本失败', 
        isLoading: false 
      });
    }
  },
  
  saveDocument: async (document) => {
    // 如果已有文档ID，则更新
    if (get().document?.id) {
      return get().updateDocument(get().document.id, document);
    }
    
    // 否则创建新文档
    return get().createDocument(document);
  },
  
  clearError: () => set({ error: null }),
}));

// 创建材料状态
export const useMaterialStore = create<MaterialState>((set, get) => ({
  materials: [],
  currentMaterial: null,
  isLoading: false,
  error: null,
  
  generateMaterial: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response: { material: { id: string; title: string; content: string; } } = await apiService.material.generateMaterial(params);
      set({ isLoading: false });
      return response;
    } catch (error: any) {
      set({ 
        error: error.message || '生成材料失败', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  getMaterials: async () => {
    set({ isLoading: true, error: null });
    try {
      const response: { materials: Array<{ id: string; title: string; content: string; }> } = await apiService.material.getMaterials();
      set({ materials: response.materials, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || '获取材料列表失败', 
        isLoading: false 
      });
    }
  },
  
  getMaterial: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response: { material: { id: string; title: string; content: string; } } = await apiService.material.getMaterial(id);
      set({ currentMaterial: response.material, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || '获取材料失败', 
        isLoading: false 
      });
    }
  },
  
  saveMaterial: async (material) => {
    set({ isLoading: true, error: null });
    try {
      const response: { material: { id: string; title: string; content: string; } } = await apiService.material.saveMaterial(material);
      set({ 
        materials: [response.material, ...get().materials],
        isLoading: false 
      });
      return response.material;
    } catch (error: any) {
      set({ 
        error: error.message || '保存材料失败', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  deleteMaterial: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.material.deleteMaterial(id);
      set({ 
        materials: get().materials.filter(material => material.id !== id),
        currentMaterial: get().currentMaterial?.id === id ? null : get().currentMaterial,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || '删除材料失败', 
        isLoading: false 
      });
    }
  },
  
  clearError: () => set({ error: null }),
}));

// 创建沟通状态
export const useCommunicationStore = create<CommunicationState>((set, get) => ({
  messages: [],
  conversations: [],
  isLoading: false,
  error: null,
  
  addMessage: (message) => {
    const newMessage = {
      id: uuidv4(),
      timestamp: Date.now(),
      ...message,
    };
    set({ messages: [...get().messages, newMessage] });
  },
  
  sendMessage: async (message) => {
    set({ isLoading: true, error: null });
    
    // 添加用户消息
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };
    set({ messages: [...get().messages, userMessage] });
    
    try {
      const response: { response: string } = await apiService.communication.sendMessage(message);
      
      // 添加AI回复
      const aiMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response.response,
        timestamp: Date.now(),
      };
      set({ messages: [...get().messages, aiMessage], isLoading: false });
      
      return aiMessage;
    } catch (error: any) {
      set({ 
        error: error.message || '发送消息失败', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  getConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response: { conversations: Array<{ id: string; title: string; messages: Array<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: number; }>; }> } = await apiService.communication.getHistory();
      set({ conversations: response.conversations, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || '获取对话历史失败', 
        isLoading: false 
      });
    }
  },
  
  saveConversation: async (title) => {
    set({ isLoading: true, error: null });
    try {
      const response: { conversation: { id: string; title: string; messages: Array<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: number; }>; } } = await apiService.communication.saveConversation({
        title,
        messages: get().messages,
      });
      set({ 
        conversations: [response.conversation, ...get().conversations],
        isLoading: false 
      });
      return response.conversation;
    } catch (error: any) {
      set({ 
        error: error.message || '保存对话失败', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  clearMessages: () => set({ messages: [] }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
}));