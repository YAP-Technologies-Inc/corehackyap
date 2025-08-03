# 🚀 Core 测试网快速开始指南

## 📋 前置要求

1. **MetaMask 钱包** - 已添加 Core 测试网
2. **Node.js** (v16 或更高版本)
3. **测试网 CORE 代币**

## 🔧 第一步：设置环境变量

### 1. 复制环境变量模板
```bash
cp .env.example .env
```

### 2. 编辑 .env 文件
```bash
# 编辑 .env 文件，添加您的私钥
nano .env
```

**必需的环境变量：**
```env
# 您的私钥 (不包含 0x 前缀)
PRIVATE_KEY=your_private_key_here

# Core 测试网 RPC URL
CORE_TESTNET_RPC_URL=https://rpc.test.btcs.network

# 网络设置
NETWORK=coreTestnet
```

## 🪙 第二步：获取测试代币

### 方法 1：使用水龙头网站
1. 访问：https://faucet.test.btcs.network/
2. 输入您的钱包地址
3. 点击 "Request CORE"

### 方法 2：使用脚本
```bash
npm run get:tokens
```

## 🔍 第三步：验证设置

```bash
npm run verify:testnet
```

如果所有检查都通过，您会看到：
```
🎉 所有检查都通过！您的 Core 测试网设置正确。
```

## 🚀 第四步：部署合约

### 1. 编译合约
```bash
npm run compile
```

### 2. 部署到测试网
```bash
npm run deploy:coreTestnet
```

### 3. 验证合约
```bash
npm run verify:coreTestnet
```

## 🧪 第五步：测试功能

### 1. 测试代币转移
```bash
cd ../YAPBackend
NETWORK=coreTestnet node transfer-tokens.js transfer
```

### 2. 测试铸造功能
```bash
NETWORK=coreTestnet node transfer-tokens.js mint <address> <amount>
```

### 3. 测试销毁功能
```bash
NETWORK=coreTestnet node transfer-tokens.js burn <amount>
```

## 📱 第六步：测试前端

### 1. 更新前端环境变量
```bash
cd ../yap-frontend-v2
```

创建 `.env.local` 文件：
```env
NEXT_PUBLIC_TOKEN_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_NETWORK_ID=1115
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ELEVENLABS_VOICE_ID=2k1RrkiAltTGNFiT6rL1
```

### 2. 启动前端
```bash
npm run dev
```

### 3. 测试功能
1. 打开浏览器访问 http://localhost:3000
2. 确保 MetaMask 已切换到 Core 测试网
3. 连接钱包
4. 测试代币功能

## 🔧 可用的命令

```bash
npm run setup:coreTestnet    # 检查 Core 测试网设置
npm run get:tokens           # 获取测试代币
npm run verify:testnet       # 验证设置
npm run deploy:coreTestnet   # 部署到测试网
npm run verify:coreTestnet   # 验证合约
npm run console:coreTestnet  # 打开控制台
```

## 🆘 故障排除

### 常见问题

1. **"私钥未设置"**
   - 确保已创建 `.env` 文件
   - 确保 `PRIVATE_KEY` 已正确设置

2. **"资金不足"**
   - 使用水龙头获取测试代币
   - 确保钱包中有 CORE 代币

3. **"网络错误"**
   - 检查 RPC URL 是否正确
   - 确保网络连接正常

4. **"MetaMask 无法连接"**
   - 确保已添加 Core 测试网
   - 检查 Chain ID 是否为 1115

## ✅ 检查清单

- [ ] MetaMask 已添加 Core 测试网
- [ ] 钱包中有测试网 CORE 代币
- [ ] `.env` 文件已正确配置
- [ ] 设置验证通过
- [ ] 合约已部署到测试网
- [ ] 合约已在浏览器上验证
- [ ] 前端可以正常连接
- [ ] 所有功能都正常工作

## 🎉 完成！

恭喜！您的 Core 测试网设置已完成。现在您可以安全地测试所有功能了！ 