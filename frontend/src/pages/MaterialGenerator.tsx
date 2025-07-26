import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HistoryIcon from '@mui/icons-material/History';
import { useMaterialStore } from '../store';
import { colors } from '../styles/theme';

const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
}));

const PreviewContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  minHeight: '300px',
  maxHeight: '600px',
  overflowY: 'auto',
  whiteSpace: 'pre-wrap',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
}));

const KnowledgePointChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`material-tabpanel-${index}`}
      aria-labelledby={`material-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const MaterialGenerator = () => {
  const { materials, isLoading, error, generateMaterial, saveMaterial, clearError } = useMaterialStore();
  const [tabValue, setTabValue] = useState(0);
  const [materialType, setMaterialType] = useState('lesson');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState(3);
  const [knowledgePoint, setKnowledgePoint] = useState('');
  const [knowledgePoints, setKnowledgePoints] = useState<string[]>([]);
  const [requirements, setRequirements] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // 清除错误提示
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        clearError();
      }, 5000);
    }
  }, [error, clearError]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddKnowledgePoint = () => {
    if (knowledgePoint.trim() && !knowledgePoints.includes(knowledgePoint.trim())) {
      setKnowledgePoints([...knowledgePoints, knowledgePoint.trim()]);
      setKnowledgePoint('');
    }
  };

  const handleDeleteKnowledgePoint = (pointToDelete: string) => {
    setKnowledgePoints(knowledgePoints.filter(point => point !== pointToDelete));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddKnowledgePoint();
    }
  };

  const handleGenerate = async () => {
    if (!subject || !grade || !title || knowledgePoints.length === 0) {
      setSnackbarMessage('请填写所有必填字段');
      setSnackbarOpen(true);
      return;
    }

    const params = {
      type: materialType,
      subject,
      grade,
      title,
      difficulty,
      knowledgePoints,
      requirements,
    };

    try {
      const result = await generateMaterial(params);
      setGeneratedContent(result.content);
      setTabValue(1); // 切换到预览标签
    } catch (err) {
      console.error('生成材料失败:', err);
    }
  };

  const handleSave = () => {
    if (!generatedContent) return;

    const material = {
      type: materialType,
      subject,
      grade,
      title,
      content: generatedContent,
      metadata: {
        difficulty,
        knowledgePoints,
        requirements,
      },
    };

    saveMaterial(material);
    setSnackbarMessage('材料已保存');
    setSnackbarOpen(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setSnackbarMessage('内容已复制到剪贴板');
    setSnackbarOpen(true);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title || '教育材料'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setSnackbarMessage('文件已下载');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const materialTypeOptions = [
    { value: 'lesson', label: '教案' },
    { value: 'exercise', label: '练习题' },
    { value: 'exam', label: '测验' },
    { value: 'handout', label: '讲义' },
  ];

  const subjectOptions = [
    { value: 'chinese', label: '语文' },
    { value: 'math', label: '数学' },
    { value: 'english', label: '英语' },
    { value: 'physics', label: '物理' },
    { value: 'chemistry', label: '化学' },
    { value: 'biology', label: '生物' },
    { value: 'history', label: '历史' },
    { value: 'geography', label: '地理' },
    { value: 'politics', label: '政治' },
  ];

  const gradeOptions = [
    { value: 'primary1', label: '小学一年级' },
    { value: 'primary2', label: '小学二年级' },
    { value: 'primary3', label: '小学三年级' },
    { value: 'primary4', label: '小学四年级' },
    { value: 'primary5', label: '小学五年级' },
    { value: 'primary6', label: '小学六年级' },
    { value: 'junior1', label: '初中一年级' },
    { value: 'junior2', label: '初中二年级' },
    { value: 'junior3', label: '初中三年级' },
    { value: 'senior1', label: '高中一年级' },
    { value: 'senior2', label: '高中二年级' },
    { value: 'senior3', label: '高中三年级' },
  ];

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        材料生成器
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        根据教学需求快速生成教案、练习题和测验，提高备课效率
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StyledPaper elevation={2}>
            <Typography variant="h6" gutterBottom>
              材料参数
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 3 }}>
              <TextField
                select
                fullWidth
                label="材料类型"
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                margin="normal"
                required
              >
                {materialTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="学科"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                margin="normal"
                required
              >
                {subjectOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="年级"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                margin="normal"
                required
              >
                {gradeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
                required
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography id="difficulty-slider" gutterBottom>
                难度级别: {difficulty}
              </Typography>
              <Slider
                value={difficulty}
                onChange={(e, newValue) => setDifficulty(newValue as number)}
                aria-labelledby="difficulty-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={5}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>知识点</Typography>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="输入知识点"
                  value={knowledgePoint}
                  onChange={(e) => setKnowledgePoint(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <IconButton color="primary" onClick={handleAddKnowledgePoint}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {knowledgePoints.map((point) => (
                  <KnowledgePointChip
                    key={point}
                    label={point}
                    onDelete={() => handleDeleteKnowledgePoint(point)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="特殊要求（可选）"
                multiline
                rows={4}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="例如：包含图表分析、重点突出某个知识点等"
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleGenerate}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoading ? '生成中...' : '生成材料'}
            </Button>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={8}>
          <StyledPaper elevation={2}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="material tabs">
                <Tab label="填写参数" />
                <Tab label="预览结果" disabled={!generatedContent} />
                <Tab label="历史记录" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <img
                  src="/assets/material-illustration.svg"
                  alt="材料生成器"
                  style={{ width: '200px', height: '200px', marginBottom: '16px' }}
                />
                <Typography variant="h6" gutterBottom>
                  开始创建您的教育材料
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: '400px' }}>
                  填写左侧的材料参数，然后点击"生成材料"按钮。AI将根据您的需求生成相应的教育材料。
                </Typography>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {generatedContent ? (
                <>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      sx={{ mr: 1 }}
                    >
                      保存
                    </Button>
                    <Button
                      startIcon={<ContentCopyIcon />}
                      onClick={handleCopy}
                      sx={{ mr: 1 }}
                    >
                      复制
                    </Button>
                    <Button
                      startIcon={<DownloadIcon />}
                      onClick={handleDownload}
                    >
                      下载
                    </Button>
                  </Box>
                  <PreviewContainer>
                    {generatedContent}
                  </PreviewContainer>
                </>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    请先生成材料
                  </Typography>
                </Box>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              {materials.length > 0 ? (
                materials.map((material, index) => (
                  <Accordion key={index} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{material.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {material.subject} | {material.grade} | 
                        {materialTypeOptions.find(opt => opt.value === material.type)?.label}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {material.content.substring(0, 200)}...
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          startIcon={<ContentCopyIcon />}
                          onClick={() => {
                            navigator.clipboard.writeText(material.content);
                            setSnackbarMessage('内容已复制到剪贴板');
                            setSnackbarOpen(true);
                          }}
                          sx={{ mr: 1 }}
                        >
                          复制
                        </Button>
                        <Button
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() => {
                            const element = document.createElement('a');
                            const file = new Blob([material.content], { type: 'text/plain' });
                            element.href = URL.createObjectURL(file);
                            element.download = `${material.title}.txt`;
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                          }}
                        >
                          下载
                        </Button>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                  <HistoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    暂无历史记录
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    生成并保存材料后将显示在此处
                  </Typography>
                </Box>
              )}
            </TabPanel>
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{ '& .MuiSnackbar-root': { zIndex: 1400 } }}
      />
    </Container>
  );
};

export default MaterialGenerator;