import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { colors } from '../styles/theme';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  },
}));

const StatCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
}));

const RecentActivityItem = styled(ListItem)(({ theme }) => ({
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`,
}));

// 模拟数据
const recentActivities = [
  {
    id: 1,
    type: 'correction',
    title: '高三英语作文批改',
    time: '10分钟前',
    icon: <EditNoteIcon />,
  },
  {
    id: 2,
    type: 'material',
    title: '初中数学函数练习生成',
    time: '1小时前',
    icon: <AutoStoriesIcon />,
  },
  {
    id: 3,
    type: 'communication',
    title: '家长沟通指导',
    time: '昨天',
    icon: <ChatIcon />,
  },
  {
    id: 4,
    type: 'correction',
    title: '初二语文作文批改',
    time: '2天前',
    icon: <EditNoteIcon />,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [usageStats] = useState({
    corrections: 28,
    materials: 15,
    communications: 42,
    totalUsage: 85,
  });

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          欢迎使用教育AI助手
        </Typography>
        <Typography variant="body1" color="text.secondary">
          智能教学辅助工具，提升教学效率与质量
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <FeatureCard elevation={2}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: colors.primary.main, mr: 2 }}>
                  <EditNoteIcon />
                </Avatar>
                <Typography variant="h6">批改编辑器</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                智能识别作文中的语法、拼写错误和表达不当，提供专业修改建议，提高批改效率。
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip
                  size="small"
                  label="语法检查"
                  sx={{ mr: 1, bgcolor: `${colors.primary.light}20` }}
                />
                <Chip
                  size="small"
                  label="表达优化"
                  sx={{ mr: 1, bgcolor: `${colors.primary.light}20` }}
                />
                <Chip
                  size="small"
                  label="智能批注"
                  sx={{ bgcolor: `${colors.primary.light}20` }}
                />
              </Box>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => handleNavigate('/correction-editor')}
              >
                开始使用
              </Button>
            </CardActions>
          </FeatureCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <FeatureCard elevation={2}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: colors.secondary.main, mr: 2 }}>
                  <AutoStoriesIcon />
                </Avatar>
                <Typography variant="h6">材料生成器</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                根据知识点和教学目标，快速生成教案、练习题和测验，节省备课时间，提高教学质量。
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip
                  size="small"
                  label="教案生成"
                  sx={{ mr: 1, bgcolor: `${colors.secondary.light}20` }}
                />
                <Chip
                  size="small"
                  label="习题生成"
                  sx={{ mr: 1, bgcolor: `${colors.secondary.light}20` }}
                />
                <Chip
                  size="small"
                  label="测验生成"
                  sx={{ bgcolor: `${colors.secondary.light}20` }}
                />
              </Box>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="secondary"
                onClick={() => handleNavigate('/material-generator')}
              >
                开始使用
              </Button>
            </CardActions>
          </FeatureCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <FeatureCard elevation={2}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: colors.info.main, mr: 2 }}>
                  <ChatIcon />
                </Avatar>
                <Typography variant="h6">沟通助手</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                提供专业的沟通策略和话术建议，帮助教师有效处理与学生、家长和同事的沟通场景。
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip
                  size="small"
                  label="家长沟通"
                  sx={{ mr: 1, bgcolor: `${colors.info.light}20` }}
                />
                <Chip
                  size="small"
                  label="学生辅导"
                  sx={{ mr: 1, bgcolor: `${colors.info.light}20` }}
                />
                <Chip
                  size="small"
                  label="冲突处理"
                  sx={{ bgcolor: `${colors.info.light}20` }}
                />
              </Box>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="info"
                onClick={() => handleNavigate('/communication-assistant')}
              >
                开始使用
              </Button>
            </CardActions>
          </FeatureCard>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StyledPaper elevation={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">最近活动</Typography>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ flexGrow: 1 }}>
              {recentActivities.map((activity) => (
                <RecentActivityItem key={activity.id} disablePadding>
                  <ListItemIcon sx={{ minWidth: 40 }}>{activity.icon}</ListItemIcon>
                  <ListItemText
                    primary={activity.title}
                    secondary={
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem' }} />
                        <Typography component="span" variant="caption">{activity.time}</Typography>
                      </span>
                    }
                  />
                  <Button
                    size="small"
                    onClick={() =>
                      handleNavigate(
                        activity.type === 'correction'
                          ? '/correction-editor'
                          : activity.type === 'material'
                          ? '/material-generator'
                          : '/communication-assistant'
                      )
                    }
                  >
                    继续
                  </Button>
                </RecentActivityItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="text">查看全部活动</Button>
            </Box>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledPaper elevation={2}>
            <Typography variant="h6" gutterBottom>
              使用统计
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <StatCard>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  批改编辑器
                </Typography>
                <Typography variant="h5">{usageStats.corrections}</Typography>
              </Box>
              <Avatar sx={{ bgcolor: `${colors.primary.light}20`, color: colors.primary.main }}>
                <EditNoteIcon />
              </Avatar>
            </StatCard>
            
            <StatCard>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  材料生成器
                </Typography>
                <Typography variant="h5">{usageStats.materials}</Typography>
              </Box>
              <Avatar sx={{ bgcolor: `${colors.secondary.light}20`, color: colors.secondary.main }}>
                <AutoStoriesIcon />
              </Avatar>
            </StatCard>
            
            <StatCard>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  沟通助手
                </Typography>
                <Typography variant="h5">{usageStats.communications}</Typography>
              </Box>
              <Avatar sx={{ bgcolor: `${colors.info.light}20`, color: colors.info.main }}>
                <ChatIcon />
              </Avatar>
            </StatCard>
            
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2">本月使用量</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon fontSize="small" color="success" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="success.main">
                    +12%
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(usageStats.totalUsage / 100) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {usageStats.totalUsage}/100
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  本月配额
                </Typography>
              </Box>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;