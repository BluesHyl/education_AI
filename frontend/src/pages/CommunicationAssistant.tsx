import { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { useCommunicationStore } from '../store';
import { colors } from '../styles/theme';
import apiService, { setAIProvider } from '../services/api';

const Container = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 100px)',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
}));

const ChatContainer = styled(Paper)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const ModelSelector = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

const ModelButton = styled(Button)(({ theme, selected }) => ({
  textTransform: 'none',
  fontWeight: selected ? 'bold' : 'normal',
  backgroundColor: selected ? theme.palette.primary.light : 'transparent',
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.light : theme.palette.action.hover,
  },
}));

const ChatMessages = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));

const MessageBubble = styled(Box)<{ isUser: boolean }>(({ theme, isUser }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  backgroundColor: isUser ? colors.primary.main : theme.palette.background.default,
  color: isUser ? theme.palette.common.white : theme.palette.text.primary,
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '50%',
    [isUser ? 'right' : 'left']: -12,
    width: 0,
    height: 0,
    border: '8px solid transparent',
    borderTopColor: isUser ? colors.primary.main : theme.palette.background.default,
    borderBottom: 0,
    marginBottom: -8,
    transform: isUser ? 'rotate(270deg) translateX(20%)' : 'none',
  },
}));

const ChatInputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const SuggestionChips = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

// 预设的沟通场景建议
const communicationSuggestions = [
  '如何与家长沟通学生成绩问题',
  '班级管理技巧',
  '处理学生冲突的方法',
  '如何激励学习积极性低的学生',
  '与同事协作的有效沟通',
  '处理家长投诉的技巧',
];

const CommunicationAssistant = () => {
  const { messages, isLoading, error, addMessage, clearMessages, setLoading, setError } = useCommunicationStore();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentModel, setCurrentModel] = useState('openai');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleModelChange = (model) => {
    setCurrentModel(model);
    setAIProvider(model);
  };
  
  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      // 添加用户消息
      addMessage({
        role: 'user',
        content: input.trim(),
      });
      
      // 清空输入框
      setInput('');
      
      // 调用后端AI服务
      setLoading(true);
      try {
        const response = await apiService.communication.sendMessage(input.trim());
        console.log('AI Response:', response);
        const data = response;
        addMessage({
          role: 'assistant',
          content: data.data,
        });
      } catch (error) {
        setError('获取AI回复失败，请稍后重试');
        console.error('AI API Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // 这里应该实现实际的语音识别功能
    console.log('开始语音输入');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // 模拟语音识别结果
    setInput(input + '通过语音输入的内容');
    console.log('停止语音输入');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClearChat = () => {
    clearMessages();
    handleMenuClose();
  };

  const handleSaveChat = () => {
    // 实现保存聊天记录功能
    console.log('保存聊天记录');
    handleMenuClose();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        沟通助手
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        获取专业的教育沟通建议，提升与学生、家长和同事的沟通效果
      </Typography>
      
      {messages.length === 0 && (
        <SuggestionChips>
          {communicationSuggestions.map((suggestion, index) => (
            <Chip
              key={index}
              label={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              color="primary"
              variant="outlined"
              clickable
            />
          ))}
        </SuggestionChips>
      )}
      
      <ChatContainer elevation={3}>
        <ChatHeader>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: colors.secondary.main, mr: 1 }}>AI</Avatar>
            <Typography variant="h6">教育沟通专家</Typography>
          </Box>
          <ModelSelector>
            <ModelButton 
              selected={currentModel === 'openai'}
              onClick={() => handleModelChange('openai')}
            >
              OpenAI
            </ModelButton>
            <ModelButton 
              selected={currentModel === 'qwen-coder'}
              onClick={() => handleModelChange('qwen-coder')}
            >
              Qwen-Coder
            </ModelButton>
          </ModelSelector>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleClearChat}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>清空对话</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleSaveChat}>
              <ListItemIcon>
                <SaveIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>保存对话</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <DownloadIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>导出为PDF</ListItemText>
            </MenuItem>
          </Menu>
        </ChatHeader>
        
        <ChatMessages>
          {messages.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                opacity: 0.7,
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                开始您的沟通咨询
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                描述您的沟通场景或问题，获取专业建议
              </Typography>
            </Box>
          ) : (
            messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  mb: 2,
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: message.role === 'user' ? colors.primary.main : colors.secondary.main,
                    mx: 1,
                  }}
                >
                  {message.role === 'user' ? 'U' : 'AI'}
                </Avatar>
                <MessageBubble isUser={message.role === 'user'}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.content}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      textAlign: 'right',
                      mt: 0.5,
                      opacity: 0.7,
                    }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </Typography>
                </MessageBubble>
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </ChatMessages>
        
        <Divider />
        
        <ChatInputContainer>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="输入您的问题或描述沟通场景..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
          />
          <IconButton
            color={isRecording ? 'error' : 'default'}
            onClick={isRecording ? handleStopRecording : handleStartRecording}
          >
            {isRecording ? <StopIcon /> : <MicIcon />}
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            发送
          </Button>
        </ChatInputContainer>
      </ChatContainer>
      
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Container>
  );
};

export default CommunicationAssistant;