#!/usr/bin/env node

/**
 * 环境变量设置助手
 * 
 * 此脚本帮助用户设置必要的环境变量
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 环境变量模板
const envTemplate = {
  // 服务器配置
  PORT: {
    value: '8000',
    description: '服务器端口号',
    required: true
  },
  NODE_ENV: {
    value: 'development',
    description: '运行环境 (development/production/test)',
    required: true
  },
  // 安全配置
  JWT_SECRET: {
    value: '',
    description: 'JWT 密钥 (请设置一个复杂的随机字符串)',
    required: true
  },
  JWT_EXPIRES_IN: {
    value: '1d',
    description: 'JWT 过期时间',
    required: true
  },
  // 数据库配置
  MONGODB_URI: {
    value: 'mongodb://localhost:27017/education_ai',
    description: 'MongoDB 连接 URI',
    required: true
  },
  // AI服务配置
  AI_PROVIDER: {
    value: 'qwen3',
    description: 'AI 服务提供商',
    required: false
  },
  AI_API_KEY: {
    value: '',
    description: 'AI API 密钥',
    required: false
  },
  AI_ENDPOINT: {
    value: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    description: 'AI API 端点',
    required: false
  },
  AI_MODEL: {
    value: 'qwen-plus',
    description: 'AI 模型名称',
    required: false
  },
  AI_TIMEOUT: {
    value: '30000',
    description: 'AI 请求超时时间 (毫秒)',
    required: false
  },
  AI_MAX_RETRIES: {
    value: '3',
    description: 'AI 请求最大重试次数',
    required: false
  },
  AI_TEMPERATURE: {
    value: '0.7',
    description: 'AI 生成温度 (0.0-1.0)',
    required: false
  },
  AI_MAX_TOKENS: {
    value: '2000',
    description: 'AI 生成最大 token 数',
    required: false
  },
  // 开源模型配置
  OPEN_SOURCE_ENDPOINT: {
    value: 'http://localhost:8000',
    description: '开源模型端点',
    required: false
  },
  OPEN_SOURCE_MODEL: {
    value: 'qwen-coder',
    description: '开源模型名称',
    required: false
  }
};

// 环境变量文件路径
const envPath = path.join(__dirname, '.env');

// 检查是否已存在 .env 文件
const envExists = fs.existsSync(envPath);

console.log('=== 教育 AI 环境变量设置助手 ===');

if (envExists) {
  console.log('检测到已存在 .env 文件。');
  rl.question('是否要重新配置环境变量？(y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      configureEnv();
    } else {
      console.log('保持现有配置。退出设置。');
      rl.close();
    }
  });
} else {
  configureEnv();
}

// 配置环境变量
function configureEnv() {
  console.log('\n请为每个环境变量设置值 (按回车接受默认值):');
  
  // 读取现有的环境变量 (如果存在)
  let existingEnv = {};
  if (envExists) {
    try {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        if (line && !line.startsWith('#')) {
          const [key, value] = line.split('=');
          if (key && value) {
            existingEnv[key.trim()] = value.trim();
          }
        }
      });
    } catch (err) {
      console.error('读取现有 .env 文件时出错:', err);
    }
  }
  
  // 递归函数来处理每个环境变量
  const envVars = Object.keys(envTemplate);
  let currentIndex = 0;
  
  function processNextVar() {
    if (currentIndex >= envVars.length) {
      // 所有变量都已处理完毕
      saveEnvFile();
      return;
    }
    
    const varName = envVars[currentIndex];
    const varConfig = envTemplate[varName];
    const existingValue = existingEnv[varName] || varConfig.value;
    const requiredText = varConfig.required ? '[必填]' : '[可选]';
    
    rl.question(`${varName} ${requiredText} (${varConfig.description}) [${existingValue}]: `, (answer) => {
      // 使用用户输入或默认值
      const value = answer.trim() || existingValue;
      existingEnv[varName] = value;
      
      currentIndex++;
      processNextVar();
    });
  }
  
  // 开始处理环境变量
  processNextVar();
  
  // 保存环境变量到文件
  function saveEnvFile() {
    let envContent = '# 教育 AI 环境变量配置\n# 自动生成于 ' + new Date().toISOString() + '\n\n';
    
    // 服务器配置
    envContent += '# 服务器配置\n';
    envContent += `PORT=${existingEnv.PORT}\n`;
    envContent += `NODE_ENV=${existingEnv.NODE_ENV}\n\n`;
    
    // 安全配置
    envContent += '# 安全配置\n';
    envContent += `JWT_SECRET=${existingEnv.JWT_SECRET}\n`;
    envContent += `JWT_EXPIRES_IN=${existingEnv.JWT_EXPIRES_IN}\n\n`;
    
    // 数据库配置
    envContent += '# 数据库配置\n';
    envContent += `MONGODB_URI=${existingEnv.MONGODB_URI}\n\n`;
    
    // AI服务配置
    envContent += '# AI服务配置\n';
    envContent += `AI_PROVIDER=${existingEnv.AI_PROVIDER}\n`;
    envContent += `AI_API_KEY=${existingEnv.AI_API_KEY}\n`;
    envContent += `AI_ENDPOINT=${existingEnv.AI_ENDPOINT}\n`;
    envContent += `AI_MODEL=${existingEnv.AI_MODEL}\n`;
    envContent += `AI_TIMEOUT=${existingEnv.AI_TIMEOUT}\n`;
    envContent += `AI_MAX_RETRIES=${existingEnv.AI_MAX_RETRIES}\n`;
    envContent += `AI_TEMPERATURE=${existingEnv.AI_TEMPERATURE}\n`;
    envContent += `AI_MAX_TOKENS=${existingEnv.AI_MAX_TOKENS}\n\n`;
    
    // 开源模型配置
    envContent += '# 开源模型配置（可选）\n';
    envContent += `OPEN_SOURCE_ENDPOINT=${existingEnv.OPEN_SOURCE_ENDPOINT}\n`;
    envContent += `OPEN_SOURCE_MODEL=${existingEnv.OPEN_SOURCE_MODEL}\n`;
    
    try {
      fs.writeFileSync(envPath, envContent);
      console.log('\n✅ 环境变量已成功保存到 .env 文件');
      console.log('您可以随时编辑此文件或重新运行此脚本进行修改');
    } catch (err) {
      console.error('保存 .env 文件时出错:', err);
    }
    
    rl.close();
  }
}

rl.on('close', () => {
  console.log('\n感谢使用环境变量设置助手！');
  process.exit(0);
});