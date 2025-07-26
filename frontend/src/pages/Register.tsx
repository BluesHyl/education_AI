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

const RegisterCard = styled(Paper)(({ theme }) => ({
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

const Register = () => {
  const { register, isLoading, error, clearError } = useUserStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateName = (name: string) => {
    if (!name) {
      setNameError('姓名不能为空');
      return false;
    } else if (name.length < 2) {
      setNameError('姓名长度不能少于2个字符');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

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

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('确认密码不能为空');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('两次输入的密码不一致');
      return false;
    } else {
      setConfirmPasswordError('');
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      await register({ username: name, email, password });
    }
  };

  return (
    <Container>
      <RegisterCard elevation={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          教育AI助手
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          创建新账户
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
            id="username"
            label="姓名"
            name="username"
            autoComplete="username"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!nameError}
            helperText={nameError}
            onBlur={() => validateName(name)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="邮箱地址"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            onBlur={() => validatePassword(password)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="确认密码"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
            onBlur={() => validateConfirmPassword(confirmPassword)}
          />
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : '注册'}
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
            to="/login"
            fullWidth
            variant="outlined"
            color="primary"
          >
            返回登录
          </Button>
        </Box>
      </RegisterCard>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        © {new Date().getFullYear()} 教育AI助手 - 智能教学辅助工具
      </Typography>
    </Container>
  );
};

export default Register;