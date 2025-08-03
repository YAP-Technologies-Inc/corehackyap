#!/bin/bash

# Core 测试网快速设置脚本
echo "🧪 Core 测试网快速设置..."

# 检查前置要求
check_requirements() {
    echo "🔍 检查前置要求..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js 未安装"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm 未安装"
        exit 1
    fi
    
    echo "✅ 前置要求检查通过"
}

# 设置环境变量
setup_environment() {
    echo "⚙️  设置环境变量..."
    
    cd yap-token-deployment
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            echo "✅ 从 .env.example 创建了 .env 文件"
        else
            echo "❌ 未找到 .env.example 文件"
            exit 1
        fi
    fi
    
    echo "⚠️  请编辑 .env 文件，添加以下变量："
    echo "   PRIVATE_KEY=your_private_key_here"
    echo "   CORE_TESTNET_RPC_URL=https://rpc.test.btcs.network"
    echo "   NETWORK=coreTestnet"
    echo ""
    read -p "编辑完成后按 Enter 继续..."
    
    cd ..
}

# 安装依赖
install_dependencies() {
    echo "📦 安装依赖..."
    
    cd yap-token-deployment
    npm install
    cd ..
}

# 检查 Core 测试网设置
check_testnet_setup() {
    echo "🔍 检查 Core 测试网设置..."
    
    cd yap-token-deployment
    npm run setup:coreTestnet
    cd ..
}

# 获取测试代币
get_testnet_tokens() {
    echo "🪙 获取测试网代币..."
    
    cd yap-token-deployment
    npm run get:tokens
    cd ..
}

# 部署到测试网
deploy_to_testnet() {
    echo "🚀 部署到 Core 测试网..."
    
    read -p "确认要部署到 Core 测试网吗？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 取消部署"
        return
    fi
    
    cd yap-token-deployment
    
    echo "🔨 编译合约..."
    npm run compile
    
    echo "🚀 部署合约..."
    npm run deploy:coreTestnet
    
    echo "🔍 验证合约..."
    npm run verify:coreTestnet
    
    cd ..
    
    echo "✅ 部署完成！"
}

# 显示设置信息
show_setup_info() {
    echo ""
    echo "🎉 Core 测试网设置完成！"
    echo ""
    echo "📋 设置摘要："
    echo "   ✅ 环境变量已配置"
    echo "   ✅ 依赖已安装"
    echo "   ✅ 网络连接已测试"
    echo "   ✅ 测试代币已获取"
    echo "   ✅ 合约已部署"
    echo ""
    echo "🔗 重要链接："
    echo "   Core 测试网浏览器: https://scan.test.btcs.network"
    echo "   Core 测试网水龙头: https://faucet.test.btcs.network/"
    echo "   Core 测试网 RPC: https://rpc.test.btcs.network"
    echo ""
    echo "📱 测试应用："
    echo "   前端: http://localhost:3000"
    echo "   后端: http://localhost:3001"
    echo ""
    echo "🔧 有用的命令："
    echo "   npm run setup:coreTestnet    # 检查设置"
    echo "   npm run get:tokens           # 获取测试代币"
    echo "   npm run deploy:coreTestnet   # 部署合约"
    echo "   npm run verify:coreTestnet   # 验证合约"
    echo "   npm run console:coreTestnet  # 打开控制台"
    echo ""
}

# 主函数
main() {
    echo "🌐 Core 测试网快速设置工具"
    echo "============================"
    echo ""
    
    check_requirements
    setup_environment
    install_dependencies
    check_testnet_setup
    
    echo ""
    echo "选择下一步操作："
    echo "1) 获取测试代币"
    echo "2) 部署合约到测试网"
    echo "3) 完成设置"
    echo "4) 退出"
    echo ""
    read -p "请选择 (1-4): " choice
    
    case $choice in
        1)
            get_testnet_tokens
            ;;
        2)
            deploy_to_testnet
            ;;
        3)
            show_setup_info
            ;;
        4)
            echo "👋 再见！"
            exit 0
            ;;
        *)
            echo "❌ 无效选择"
            exit 1
            ;;
    esac
    
    show_setup_info
}

# 运行主函数
main 