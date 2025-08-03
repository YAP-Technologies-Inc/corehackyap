# YAP Project Core 设置指南

## 什么是 Core？

Core 是一个现代化的应用部署和管理平台，可以帮助您更高效地构建、部署和管理您的应用。

## 安装 Core

```bash
# 安装 Core CLI
npm install -g @core/cli

# 验证安装
core --version
```

## 项目结构

```
pondhackathon/
├── core.yaml          # Core 配置文件
├── core-deploy.sh     # Core 部署脚本
├── package.json       # 根项目配置
├── .coreignore        # Core 忽略文件
├── yap-frontend-v2/   # 前端应用
├── YAPBackend/        # 后端 API
└── yap-token-deployment/ # 智能合约部署
```

## 快速开始

### 1. 安装依赖

```bash
# 安装所有依赖
npm run install:all
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp env.example .env

# 编辑 .env 文件，添加必要的 API 密钥
```

必需的环境变量：
- `ETHEREUM_RPC_URL`: 以太坊 RPC URL
- `PRIVATE_KEY`: 私钥
- `AZURE_SPEECH_KEY`: Azure 语音服务密钥
- `ELEVENLABS_API_KEY`: ElevenLabs API 密钥

### 3. 使用 Core 部署

```bash
# 开发模式
npm run dev

# 生产部署
npm run deploy

# 查看状态
npm run status

# 查看日志
npm run logs

# 停止服务
npm run stop
```

## Core 命令

### 基本命令

```bash
# 开发模式启动
core dev

# 构建项目
core build

# 部署到生产环境
core deploy

# 启动服务
core start

# 停止服务
core stop

# 查看服务状态
core status

# 查看日志
core logs

# 重启服务
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