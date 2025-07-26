import { useState } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import { useUserStore } from '../store';
import { colors } from '../styles/theme';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 450,
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const Form = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  height: 48,
}));

const Login = () => {
  const { login, isLoading, error, clearError } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('邮箱不能为空');
      return false;
    } else if (!re.test(email)) {
      setEmailError('请输入有效的邮箱地址');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('密码不能为空');
      return false;
    } else if (password.length < 6) {
      setPasswordError('密码长度不能少于6个字符');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      await login({ email, password });
    }
  };

  return (
    <Container>
      <LoginCard elevation={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          教育AI助手
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          登录您的账户
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="邮箱地址"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            onBlur={() => validateEmail(email)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="密码"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            onBlur={() => validatePassword(password)}
          />
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : '登录'}
          </SubmitButton>
        </Form>

        <Box sx={{ mt: 2, width: '100%' }}>
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              或者
            </Typography>
          </Divider>
          <Button
            component={Link}
            to="/register"
            fullWidth
            variant="outlined"
            color="primary"
          >
            注册新账户
          </Button>
        </Box>
      </LoginCard>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        © {new Date().getFullYear()} 教育AI助手 - 智能教学辅助工具
      </Typography>
    </Container>
  );
};

export default Login;