import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import router from './routes';
import theme from './styles/theme';
import { useUserStore } from './store';

// 初始化应用
const App = () => {
  const { getProfile } = useUserStore();
  
  // 在应用加载时检查用户登录状态
  React.useEffect(() => {
    getProfile();
  }, [getProfile]);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);