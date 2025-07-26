import { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import { useCorrectionStore } from '../store';
import { colors } from '../styles/theme';

const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
}));

const EditorContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 'calc(100vh - 250px)',
  display: 'flex',
  flexDirection: 'column',
}));

const EditorToolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const EditorContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  position: 'relative',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const TextArea = styled('textarea')(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: theme.spacing(2),
  border: 'none',
  outline: 'none',
  resize: 'none',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: '16px',
  lineHeight: 1.5,
  backgroundColor: theme.palette.background.default,
}));

const CorrectionPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const CorrectionList = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  marginTop: theme.spacing(2),
}));

const CorrectionItem = styled(Box)<{ severity: string }>(({ theme, severity }) => {
  const getColor = () => {
    switch (severity) {
      case 'error':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'suggestion':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: `${getColor()}10`,
    borderLeft: `4px solid ${getColor()}`,
    '&:hover': {
      backgroundColor: `${getColor()}20`,
    },
  };
});

const CorrectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const CorrectionActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(1),
}));

const CorrectionChip = styled(Chip)<{ severity: string }>(({ theme, severity }) => {
  const getColor = () => {
    switch (severity) {
      case 'error':
        return theme.palette.error;
      case 'warning':
        return theme.palette.warning;
      case 'suggestion':
        return theme.palette.info;
      default:
        return theme.palette.primary;
    }
  };

  return {
    backgroundColor: `${getColor().main}20`,
    color: getColor().main,
    borderColor: getColor().main,
  };
});

const CorrectionEditor = () => {
  const { document, corrections, isLoading, error, analyzeText, saveDocument, clearError } = useCorrectionStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // 清除错误提示
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        clearError();
      }, 5000);
    }
  }, [error, clearError]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setSnackbarMessage('请输入文本内容');
      setSnackbarOpen(true);
      return;
    }

    try {
      await analyzeText(content);
    } catch (err) {
      console.error('分析文本失败:', err);
    }
  };

  const handleSaveClick = () => {
    if (!title.trim()) {
      setSaveDialogOpen(true);
    } else {
      handleSave();
    }
  };

  const handleSave = () => {
    if (!content.trim()) {
      setSnackbarMessage('请输入文本内容');
      setSnackbarOpen(true);
      return;
    }

    const documentData = {
      title: title || '未命名文档',
      content,
    };

    saveDocument(documentData);
    setSaveDialogOpen(false);
    setSnackbarMessage('文档已保存');
    setSnackbarOpen(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setSnackbarMessage('内容已复制到剪贴板');
    setSnackbarOpen(true);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title || '未命名文档'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setSnackbarMessage('文件已下载');
    setSnackbarOpen(true);
  };

  const handleApplyCorrection = (correction: any) => {
    if (!textAreaRef.current) return;

    const start = correction.position.start;
    const end = correction.position.end;
    const newText = correction.suggestion || '';

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);

    // 更新光标位置
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        textAreaRef.current.setSelectionRange(start + newText.length, start + newText.length);
      }
    }, 0);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'suggestion':
        return <LightbulbIcon color="info" />;
      default:
        return <CheckCircleIcon color="primary" />;
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'error':
        return '错误';
      case 'warning':
        return '警告';
      case 'suggestion':
        return '建议';
      default:
        return '信息';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'grammar':
        return <FormatColorTextIcon fontSize="small" />;
      case 'spelling':
        return <SpellcheckIcon fontSize="small" />;
      case 'expression':
        return <GTranslateIcon fontSize="small" />;
      default:
        return <FormatColorTextIcon fontSize="small" />;
    }
  };

  // 模拟批改数据
  const mockCorrections = [
    {
      id: '1',
      type: 'grammar',
      severity: 'error',
      position: { start: 10, end: 15 },
      comment: '语法错误：主谓不一致',
      suggestion: '他们是',
    },
    {
      id: '2',
      type: 'spelling',
      severity: 'warning',
      position: { start: 25, end: 28 },
      comment: '拼写错误：应为"their"',
      suggestion: 'their',
    },
    {
      id: '3',
      type: 'expression',
      severity: 'suggestion',
      position: { start: 40, end: 50 },
      comment: '表达建议：可以使用更准确的词语',
      suggestion: '全面发展',
    },
  ];

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        批改编辑器
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        智能识别文本中的错误并提供修改建议，提高批改效率
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StyledPaper elevation={2}>
            <EditorContainer>
              <EditorToolbar>
                <TextField
                  placeholder="文档标题"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  variant="standard"
                  fullWidth
                  sx={{ mr: 2 }}
                />
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAnalyze}
                    disabled={isLoading || !content.trim()}
                    sx={{ mr: 1 }}
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                        分析中...
                      </>
                    ) : (
                      '智能分析'
                    )}
                  </Button>
                  <IconButton onClick={handleMenuOpen}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleSaveClick}>
                      <ListItemIcon>
                        <SaveIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>保存文档</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleCopy}>
                      <ListItemIcon>
                        <ContentCopyIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>复制内容</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleDownload}>
                      <ListItemIcon>
                        <DownloadIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>下载文档</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleMenuClose}>
                      <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>清空内容</ListItemText>
                    </MenuItem>
                  </Menu>
                </Box>
              </EditorToolbar>
              <EditorContent>
                <TextArea
                  ref={textAreaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="在此输入需要批改的文本..."
                />
              </EditorContent>
            </EditorContainer>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledPaper elevation={2}>
            <CorrectionPanel>
              <Typography variant="h6" gutterBottom>
                批改结果
              </Typography>
              <Divider />

              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : corrections.length > 0 || mockCorrections.length > 0 ? (
                <CorrectionList>
                  {(corrections.length > 0 ? corrections : mockCorrections).map((correction) => (
                    <CorrectionItem key={correction.id} severity={correction.severity}>
                      <CorrectionHeader>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getSeverityIcon(correction.severity)}
                          <Typography variant="subtitle1" sx={{ ml: 1 }}>
                            {correction.type === 'grammar' ? '语法' : correction.type === 'spelling' ? '拼写' : '表达'}
                          </Typography>
                        </Box>
                        <CorrectionChip
                          size="small"
                          label={getSeverityLabel(correction.severity)}
                          severity={correction.severity}
                          variant="outlined"
                          icon={getTypeIcon(correction.type)}
                        />
                      </CorrectionHeader>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {correction.comment}
                      </Typography>
                      {correction.suggestion && (
                        <Box sx={{ backgroundColor: 'background.default', p: 1, borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            建议修改为:
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {correction.suggestion}
                          </Typography>
                        </Box>
                      )}
                      <CorrectionActions>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => handleApplyCorrection(correction)}
                        >
                          应用修改
                        </Button>
                      </CorrectionActions>
                    </CorrectionItem>
                  ))}
                </CorrectionList>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography variant="body1" color="text.secondary" align="center">
                    输入文本并点击"智能分析"按钮，获取批改建议
                  </Typography>
                </Box>
              )}
            </CorrectionPanel>
          </StyledPaper>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>保存文档</DialogTitle>
        <DialogContent>
          <DialogContentText>
            请为您的文档输入一个标题
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="文档标题"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>取消</Button>
          <Button onClick={handleSave} color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CorrectionEditor;