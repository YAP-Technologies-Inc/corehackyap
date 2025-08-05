# YAP Project Core Setup Guide

## What is Core?

Core is a modern application deployment and management platform that helps you build, deploy, and manage your applications more efficiently.

## Install Core

```bash
# Install Core CLI
npm install -g @core/cli

# Verify installation
core --version
```

## Project Structure

```
pondhackathon/
├── core.yaml          # Core configuration file
├── core-deploy.sh     # Core deployment script
├── package.json       # Root project config
├── .coreignore        # Core ignore file
├── yap-frontend-v2/   # Frontend application
├── YAPBackend/        # Backend API
└── yap-token-deployment/ # Smart contract deployment
```

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies
npm run install:all
```

### 2. Configure Environment Variables

```bash
# Copy environment template
cp env.example .env

# Edit .env file, add necessary API keys
```

Required environment variables:
- `CORE_RPC_URL`: Core blockchain RPC URL
- `PRIVATE_KEY`: Private key
- `AZURE_SPEECH_KEY`: Azure Speech Services key
- `ELEVENLABS_API_KEY`: ElevenLabs API key

### 3. Deploy with Core

```bash
# Development mode
npm run dev

# Production deployment
npm run deploy

# Check status
npm run status

# View logs
npm run logs

# Stop services
npm run stop
```

## Core Commands

### Basic Commands

```bash
# Start development mode
core dev

# Build project
core build

# Deploy to production
core deploy

# Start services
core start

# Stop services
core stop

# Check service status
core status

# View logs
core logs

# Restart services
core restart
```

### 工作流命令

```bash
# 运行部署工作流
core workflow run deploy

# 运行开发工作流
core workflow run dev

# 查看工作流状态
core workflow status
```

## 与传统 Docker 部署的对比

### 传统 Docker 方式
```bash
# 使用 Docker Compose
docker-compose up -d
docker-compose down
docker-compose logs -f
```

### Core 方式
```bash
# 使用 Core
core deploy
core stop
core logs
```

## 优势

1. **简化部署**: Core 提供统一的部署接口
2. **更好的开发体验**: 内置热重载和开发工具
3. **环境管理**: 更好的环境变量和配置管理
4. **监控和日志**: 内置的监控和日志功能
5. **扩展性**: 易于添加新服务和组件

## 故障排除

### 常见问题

1. **Core 未安装**
   ```bash
   npm install -g @core/cli
   ```

2. **端口冲突**
   - 检查 3000, 3001, 5433 端口是否被占用
   - 使用 `core status` 查看服务状态

3. **环境变量问题**
   - 确保 `.env` 文件存在且包含所有必需的变量
   - 使用 `core logs` 查看详细错误信息

4. **数据库连接问题**
   - 确保 PostgreSQL 服务已启动
   - 检查数据库连接配置

### 调试命令

```bash
# 查看详细日志
core logs --follow

# 检查配置
core config validate

# 重置环境
core reset
```

## 迁移指南

如果您想从现有的 Docker Compose 部署迁移到 Core：

1. **备份现有数据**
   ```bash
   docker-compose down
   # 备份数据库数据
   ```

2. **使用 Core 部署**
   ```bash
   core deploy
   ```

3. **验证部署**
   ```bash
   core status
   curl http://localhost:3000
   curl http://localhost:3001/api/health
   ```

## 支持

如需帮助，请查看：
- Core 官方文档
- 项目 README.md
- 提交 Issue 到项目仓库 