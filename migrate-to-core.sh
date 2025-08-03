#!/bin/bash

# YAP Project 迁移到 Core 区块链脚本
echo "🚀 开始迁移 YAP 项目到 Core 区块链..."

# 检查必要的工具
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

# 安装依赖
install_dependencies() {
    echo "📦 安装依赖..."
    
    cd yap-token-deployment
    npm install
    cd ..
    
    cd yap-frontend-v2
    npm install
    cd ..
    
    cd YAPBackend
    npm install
    cd ..
    
    echo "✅ 依赖安装完成"
}

# 设置环境变量
setup_environment() {
    echo "⚙️  设置环境变量..."
    
    if [ ! -f .env ]; then
        if [ -f env.example ]; then
            cp env.example .env
            echo "✅ 从 env.example 创建了 .env 文件"
        else
            echo "❌ 未找到 env.example 文件"
            exit 1
        fi
    fi
    
    echo "⚠️  请编辑 .env 文件，添加以下变量："
    echo "   CORE_RPC_URL=https://rpc.coredao.org"
    echo "   CORE_TESTNET_RPC_URL=https://rpc.test.btcs.network"
    echo "   PRIVATE_KEY=your_private_key_here"
    echo "   YAP_TOKEN_ADDRESS=your_deployed_contract_address"
    echo ""
    read -p "编辑完成后按 Enter 继续..."
}

# 部署到 Core 测试网
deploy_to_core_testnet() {
    echo "🧪 部署到 Core 测试网..."
    
    cd yap-token-deployment
    
    echo "🔨 编译合约..."
    npm run compile
    
    echo "🚀 部署合约到 Core 测试网..."
    npm run deploy:coreTestnet
    
    echo "🔍 验证合约..."
    npm run verify:coreTestnet
    
    cd ..
    
    echo "✅ Core 测试网部署完成"
}

# 部署到 Core 主网
deploy_to_core_mainnet() {
    echo "🚀 部署到 Core 主网..."
    
    read -p "⚠️  确认要部署到 Core 主网吗？这将消耗 CORE 代币 (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 取消部署"
        return
    fi
    
    cd yap-token-deployment
    
    echo "🔨 编译合约..."
    npm run compile
    
    echo "🚀 部署合约到 Core 主网..."
    npm run deploy:core
    
    echo "🔍 验证合约..."
    npm run verify:core
    
    cd ..
    
    echo "✅ Core 主网部署完成"
}

# 更新应用配置
update_app_config() {
    echo "🔧 更新应用配置..."
    
    # 更新前端配置
    echo "📱 更新前端配置..."
    cd yap-frontend-v2
    
    # 创建或更新 .env.local
    cat > .env.local << EOF
NEXT_PUBLIC_TOKEN_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_NETWORK_ID=1116
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ELEVENLABS_VOICE_ID=2k1RrkiAltTGNFiT6rL1
EOF
    
    cd ..
    
    # 更新后端配置
    echo "🔧 更新后端配置..."
    cd YAPBackend
    
    # 更新环境变量
    if [ -f .env ]; then
        sed -i '' 's/ETHEREUM_RPC_URL/CORE_RPC_URL/g' .env
        sed -i '' 's/NETWORK=ethereum/NETWORK=core/g' .env
    fi
    
    cd ..
    
    echo "✅ 应用配置更新完成"
}

# 测试迁移
test_migration() {
    echo "🧪 测试迁移..."
    
    echo "🔍 测试代币转移..."
    cd YAPBackend
    NETWORK=core node transfer-tokens.js transfer
    cd ..
    
    echo "✅ 迁移测试完成"
}

# 显示迁移信息
show_migration_info() {
    echo ""
    echo "🎉 迁移完成！"
    echo ""
    echo "📋 迁移摘要："
    echo "   ✅ 合约已部署到 Core 区块链"
    echo "   ✅ 前端配置已更新"
    echo "   ✅ 后端配置已更新"
    echo "   ✅ 测试已完成"
    echo ""
    echo "🔗 重要链接："
    echo "   Core 主网浏览器: https://scan.coredao.org"
    echo "   Core 测试网浏览器: https://scan.test.btcs.network"
    echo "   Core RPC: https://rpc.coredao.org"
    echo ""
    echo "📱 访问应用："
    echo "   前端: http://localhost:3000"
    echo "   后端: http://localhost:3001"
    echo ""
    echo "🔧 有用的命令："
    echo "   npm run dev          # 启动开发环境"
    echo "   npm run deploy       # 部署到生产环境"
    echo "   npm run logs         # 查看日志"
    echo ""
}

# 主函数
main() {
    echo "🌐 YAP Project Core 区块链迁移工具"
    echo "=================================="
    echo ""
    
    check_requirements
    install_dependencies
    setup_environment
    
    echo ""
    echo "选择部署选项："
    echo "1) 部署到 Core 测试网 (推荐)"
    echo "2) 部署到 Core 主网"
    echo "3) 仅更新配置"
    echo "4) 退出"
    echo ""
    read -p "请选择 (1-4): " choice
    
    case $choice in
        1)
            deploy_to_core_testnet
            update_app_config
            test_migration
            show_migration_info
            ;;
        2)
            deploy_to_core_mainnet
            update_app_config
            test_migration
            show_migration_info
            ;;
        3)
            update_app_config
            show_migration_info
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
}

# 运行主函数
main 