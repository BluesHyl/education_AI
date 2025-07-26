# 环境变量配置指南

本项目使用环境变量来配置各种设置，如服务器端口、数据库连接、API密钥等。

## 快速设置

我们提供了一个交互式脚本来帮助您设置环境变量：

```bash
# 进入后端目录
cd backend

# 运行设置脚本
npm run setup-env
```

此脚本将引导您完成所有必要环境变量的设置过程。

## 手动设置

如果您想手动设置环境变量，请按照以下步骤操作：

1. 复制 `.env.example` 文件并重命名为 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 使用文本编辑器打开 `.env` 文件并根据需要修改值。

## 必要的环境变量

以下环境变量是必须设置的：

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| PORT | 服务器端口号 | 8000 |
| JWT_SECRET | JWT 密钥（请使用强随机字符串） | - |
| MONGODB_URI | MongoDB 连接 URI | mongodb://localhost:27017/education_ai |

## AI 服务配置（可选）

如果您想使用 AI 功能，需要设置以下环境变量：

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| AI_PROVIDER | AI 服务提供商 | qwen3 |
| AI_API_KEY | AI API 密钥 | - |
| AI_MODEL | AI 模型名称 | qwen-plus |
| AI_ENDPOINT | AI API 端点 | https://dashscope.aliyuncs.com/compatible-mode/v1 |

## 开源模型配置（可选）

如果您想使用开源模型，需要设置以下环境变量：

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| OPEN_SOURCE_ENDPOINT | 开源模型端点 | http://localhost:8000 |
| OPEN_SOURCE_MODEL | 开源模型名称 | qwen-coder |

## 环境变量完整列表

请参考 `.env.example` 文件获取所有可用环境变量的完整列表及其说明。