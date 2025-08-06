# 🌐 YAP Project Core 区块链迁移总结

## 📋 迁移概述

您的 YAP 项目已成功配置为支持 Core 区块链。以下是迁移的详细信息和步骤。

## 🔧 已完成的配置

### 1. 智能合约配置
- ✅ 更新了 `hardhat.config.js` 以支持 Core 区块链
- ✅ Added Core mainnet (Chain ID: 1116) and testnet2 (Chain ID: 1114) configuration
- ✅ 创建了专门的 Core 部署脚本 (`deploy-core.js`)
- ✅ 创建了 Core 合约验证脚本 (`verify-core.js`)

### 2. 前端配置
- ✅ 更新了 `YAPToken.ts` ABI 以支持完整的 ERC20 功能
- ✅ 添加了 Core 区块链网络配置
- ✅ 更新了 `useYAPToken.ts` hook 以支持 Core 区块链
- ✅ 添加了网络切换功能

### 3. 后端配置
- ✅ 更新了 `transfer-tokens.js` 以支持 Core 区块链
- ✅ 添加了多网络支持 (Core, Core Testnet, Ethereum)
- ✅ 添加了铸造和销毁代币功能
- ✅ 改进了错误处理和用户反馈

### 4. 部署脚本
- ✅ 创建了 `migrate-to-core.sh` 自动化迁移脚本
- ✅ 更新了 `package.json` 添加 Core 部署命令
- ✅ 创建了详细的部署指南 (`CORE_DEPLOYMENT_GUIDE.md`)

## 🚀 快速开始

### 1. 安装依赖
```bash
cd yap-token-deployment
npm install
```

### 2. 配置环境变量
创建 `.env` 文件：
```env
PRIVATE_KEY=your_private_key_here
CORE_RPC_URL=https://rpc.coredao.org
CORE_TESTNET_RPC_URL=https://rpc.test.btcs.network
YAP_TOKEN_ADDRESS=your_deployed_contract_address
```

### 3. 部署到 Core 测试网
```bash
npm run deploy:coreTestnet
npm run verify:coreTestnet
```

### 4. 部署到 Core 主网
```bash
npm run deploy:core
npm run verify:core
```

## 📱 使用 Core 区块链

### 前端使用
```typescript
import { useYAPToken } from '@/hooks/useYAPToken';

const { 
  connectWallet, 
  switchToCore, 
  transferTokens, 
  mintTokens, 
  burnTokens 
} = useYAPToken();

// 连接到钱包
await connectWallet();

// 切换到 Core 区块链
await switchToCore();

// 转移代币
await transferTokens(toAddress, amount);

// 铸造代币 (仅所有者)
await mintTokens(toAddress, amount);

// 销毁代币
await burnTokens(amount);
```

### 后端使用
```bash
# 转移代币
NETWORK=core node transfer-tokens.js transfer

# 铸造代币
NETWORK=core node transfer-tokens.js mint <address> <amount>

# 销毁代币
NETWORK=core node transfer-tokens.js burn <amount>
```

## 🌐 Core 区块链信息

### 网络详情
- **主网 Chain ID**: 1116
- **Testnet2 Chain ID**: 1114
- **主网 RPC**: https://rpc.coredao.org
- **测试网 RPC**: https://rpc.test.btcs.network
- **主网浏览器**: https://scan.coredao.org
- **测试网浏览器**: https://scan.test.btcs.network

### Gas 费用
- Core 区块链的 gas 费用通常比以太坊低
- 平均交易费用约为 0.001-0.01 CORE

## 🔄 从以太坊迁移

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

## 📋 迁移检查清单

- [ ] 合约已部署到 Core 区块链
- [ ] 合约已在 Core 浏览器上验证
- [ ] 前端环境变量已更新
- [ ] 后端环境变量已更新
- [ ] 网络 ID 已更改为 1116
- [ ] 代币转移功能已测试
- [ ] 铸造功能已测试 (如需要)
- [ ] 销毁功能已测试
- [ ] 用户界面已更新以显示 Core 网络

## 🆘 故障排除

### 常见问题

1. **"资金不足"**
   - 确保钱包中有足够的 CORE 代币支付 gas 费用

2. **"网络错误"**
   - 检查 RPC URL 是否正确
   - 验证网络连接

3. **"合约验证失败"**
   - 检查 Core 浏览器 API key
   - 确保合约编译成功

4. **"前端无法连接"**
   - 确保 MetaMask 已切换到 Core 网络
   - 检查环境变量配置

### 调试命令

```bash
# 检查网络连接
curl https://rpc.coredao.org

# 查看合约状态
curl https://scan.coredao.org/api?module=contract&action=getabi&address=YOUR_CONTRACT_ADDRESS

# 查看交易状态
curl https://scan.coredao.org/api?module=proxy&action=eth_getTransactionByHash&txhash=YOUR_TX_HASH
```

## 📞 支持

如需帮助：
1. 查看 Core 区块链官方文档
2. 检查项目 README.md
3. 验证环境变量配置
4. 在项目仓库提交 Issue

## 🎉 迁移完成

恭喜！您的 YAP 项目现在已成功配置为支持 Core 区块链。您可以享受更低的 gas 费用和更快的交易确认时间。

---

**注意**: 请确保在生产环境中使用前充分测试所有功能。 