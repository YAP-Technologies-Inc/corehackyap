# 🚀 YAP Token Core 区块链部署指南

本指南将帮助您将 YAP Token 部署到 Core 区块链上。

## 📋 前置要求

1. **Node.js** (v16 或更高版本)
2. **MetaMask** 钱包，包含 CORE 代币用于支付 gas 费用
3. **Core 区块链 RPC URL**
4. **Core 区块链浏览器 API Key** (用于合约验证)

## 🔧 第一步：环境设置

### 1.1 安装依赖
```bash
npm install
```

### 1.2 创建环境文件
在根目录创建 `.env` 文件：

```env
# 您的私钥 (不包含 0x 前缀)
PRIVATE_KEY=your_private_key_here

# Core 区块链 RPC URL
CORE_RPC_URL=https://rpc.coredao.org
CORE_TESTNET_RPC_URL=https://rpc.test.btcs.network

# 以太坊 RPC URL (保留原有配置)
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
GOERLI_RPC_URL=https://goerli.infura.io/v3/YOUR_INFURA_KEY
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Core 区块链浏览器 API Key (用于合约验证)
CORE_SCAN_API_KEY=your_core_scan_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 1.3 获取必需的 API 密钥

#### Core 区块链浏览器 API Key:
1. 访问 [Core Scan](https://scan.coredao.org)
2. 注册并创建账户
3. 进入 API Keys 部分
4. 创建新的 API key
5. 将其添加到 `.env` 文件中

## 🧪 第二步：测试部署 (推荐)

在部署到主网之前，先在测试网上测试：

### 2.1 部署到 Core 测试网
```bash
npm run deploy:coreTestnet
```

### 2.2 在 Core 浏览器上验证合约
```bash
npm run verify:coreTestnet
```

### 2.3 测试代币功能
- 在地址之间转移代币
- 测试铸造功能 (如果您是所有者)
- 测试销毁代币功能

## 🚀 第三步：部署到 Core 主网

### 3.1 确保您有足够的 CORE 代币
- 检查您的钱包是否至少有 0.1 CORE 用于 gas 费用
- 主网部署费用约为 $10-50，取决于 gas 价格

### 3.2 部署合约
```bash
npm run deploy:core
```

### 3.3 保存部署信息
脚本将输出重要信息：
- 合约地址
- 部署者地址
- 总供应量
- 网络详情

### 3.4 在 Core 浏览器上验证合约
```bash
npm run verify:core
```

## 🔍 第四步：更新您的应用

### 4.1 更新前端环境
在前端 `.env` 文件中：
```env
NEXT_PUBLIC_TOKEN_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_NETWORK_ID=1116
```

### 4.2 更新后端环境
在后端 `.env` 文件中：
```env
YAP_TOKEN_ADDRESS=your_deployed_contract_address
CORE_RPC_URL=https://rpc.coredao.org
PRIVATE_KEY=your_private_key_here
```

## 📊 第五步：部署后检查清单

- [ ] 合约成功部署
- [ ] 合约在 Core 浏览器上验证
- [ ] 代币名称和符号正确
- [ ] 总供应量符合预期
- [ ] 前端环境已更新
- [ ] 后端环境已更新
- [ ] 测试代币转移
- [ ] 测试铸造功能 (如需要)
- [ ] 测试销毁功能

## 🔧 第六步：合约管理

### 铸造代币 (仅所有者)
```javascript
// 使用 ethers.js
const contract = new ethers.Contract(contractAddress, abi, signer);
const tx = await contract.mint(userAddress, ethers.parseEther("100"));
await tx.wait();
```

### 销毁代币 (任何用户)
```javascript
const tx = await contract.burn(ethers.parseEther("10"));
await tx.wait();
```

## ⚠️ 重要安全注意事项

1. **永远不要分享您的私钥**
2. **使用环境变量存储敏感数据**
3. **先在测试网上充分测试**
4. **保持私钥安全**
5. **考虑使用硬件钱包进行主网部署**

## 🆘 故障排除

### 常见问题：

1. **"资金不足"**
   - 向您的钱包添加更多 CORE 代币

2. **"Gas 估算失败"**
   - 检查您的 RPC URL 是否正确
   - 确保您有足够的 CORE 代币

3. **"合约验证失败"**
   - 仔细检查您的 Core 浏览器 API key
   - 确保合约编译成功

4. **"网络错误"**
   - 检查您的 Core RPC URL
   - 验证网络配置

## 🌐 Core 区块链信息

### 网络详情
- **主网 Chain ID**: 1116
- **测试网 Chain ID**: 1115
- **主网 RPC**: https://rpc.coredao.org
- **测试网 RPC**: https://rpc.test.btcs.network
- **主网浏览器**: https://scan.coredao.org
- **测试网浏览器**: https://scan.test.btcs.network

### Gas 费用
- Core 区块链的 gas 费用通常比以太坊低
- 平均交易费用约为 0.001-0.01 CORE

## 📞 支持

如果遇到问题：
1. 查看 Core 区块链官方文档
2. 验证您的环境变量
3. 检查 Core 区块链网络状态
4. 在项目仓库提交 Issue

## 🔄 从以太坊迁移到 Core

如果您想从以太坊迁移到 Core 区块链：

1. **备份现有数据**
   ```bash
   # 备份以太坊上的代币余额
   ```

2. **在 Core 上重新部署**
   ```bash
   npm run deploy:core
   ```

3. **更新应用配置**
   - 更新前端和后端的环境变量
   - 更新网络 ID 为 1116

4. **验证部署**
   ```bash
   npm run verify:core
   curl https://scan.coredao.org/address/your_contract_address
   ``` 