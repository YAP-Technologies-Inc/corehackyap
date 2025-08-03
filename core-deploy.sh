#!/bin/bash

# YAP Project Core Deployment Script
echo "🚀 Starting YAP Project Core Deployment..."

# 检查 Core 是否安装
if ! command -v core &> /dev/null; then
    echo "❌ Core CLI 未安装。请先安装 Core:"
    echo "   npm install -g @core/cli"
    exit 1
fi

# 检查环境变量文件
if [ ! -f .env ]; then
    echo "⚠️  .env 文件未找到。从示例文件创建..."
    if [ -f env.example ]; then
        cp env.example .env
        echo "✅ 从 env.example 创建了 .env 文件"
        echo "⚠️  请在继续之前编辑 .env 文件中的 API 密钥"
        echo "   必需的密钥: ETHEREUM_RPC_URL, PRIVATE_KEY, AZURE_SPEECH_KEY, ELEVENLABS_API_KEY"
        read -p "编辑 .env 文件后按 Enter..."
    else
        echo "❌ 未找到 env.example 文件。请手动创建 .env 文件。"
        exit 1
    fi
fi

# 停止现有服务
echo "🛑 停止现有服务..."
core stop

# 构建和启动服务
echo "🔨 构建和启动服务..."
core deploy

# 等待服务就绪
echo "⏳ 等待服务就绪..."
sleep 15

# 检查服务状态
echo "📊 检查服务状态..."
core status

# 显示访问信息
echo ""
echo "🎉 部署完成！"
echo ""
echo "📱 访问您的应用:"
echo "   前端: http://localhost:3000"
echo "   后端 API: http://localhost:3001"
echo "   数据库: localhost:5433"
echo ""
echo "📋 有用的命令:"
echo "   查看日志: core logs"
echo "   停止服务: core stop"
echo "   重启: core restart"
echo "   开发模式: core dev"
echo ""
echo "🔍 健康检查:"
echo "   后端: curl http://localhost:3001/api/health"
echo "   前端: curl http://localhost:3000" 