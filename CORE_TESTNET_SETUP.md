# 🧪 Core 测试网设置指南

## 📋 前置要求

1. **MetaMask 钱包**
2. **Node.js** (v16 或更高版本)
3. **npm** 或 **yarn**

## 🔧 第一步：添加 Core 测试网到 MetaMask

### 手动添加网络

1. 打开 MetaMask
2. 点击网络选择器（显示当前网络名称）
3. 选择 "添加网络" → "手动添加网络"
4. 填写以下信息：

```
网络名称: Core Testnet
RPC URL: https://rpc.test.btcs.network
Chain ID: 1115
货币符号: CORE
区块浏览器 URL: https://scan.test.btcs.network
```

### 自动添加网络

您也可以使用以下 JavaScript 代码自动添加网络：

```javascript
// 在浏览器控制台中运行
const addCoreTestnet = async () => {
  try {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x45B', // 1115 in hex
        chainName: 'Core Testnet',
        nativeCurrency: {
          name: 'CORE',
          symbol: 'CORE',
          decimals: 18,
        },
        rpcUrls: ['https://rpc.test.btcs.network'],
        blockExplorerUrls: ['https://scan.test.btcs.network'],
      }],
    });
    console.log('✅ Core 测试网添加成功！');
  } catch (error) {
    console.error('❌ 添加失败:', error);
  }
};

addCoreTestnet();
```

## 🪙 第二步：获取测试网 CORE 代币

### 方法 1：使用官方水龙头

1. 访问 Core 测试网水龙头：https://faucet.test.btcs.network/
2. 输入您的钱包地址
3. 点击 "Request CORE"
4. 等待几分钟，代币会自动发送到您的钱包

### 方法 2：使用 Discord 水龙头

1. 加入 Core 官方 Discord：https://discord.gg/core
2. 在 `#testnet-faucet` 频道中请求测试代币
3. 使用命令：`!faucet <your_wallet_address>`

### 方法 3：使用脚本获取

```bash
cd hackathon/yap-token-deployment
npm run get:tokens
```

## 🔧 第三步：配置项目环境

### 1. 创建环境文件

```bash
cd hackathon/yap-token-deployment
cp .env.example .env
```

### 2. 编辑 .env 文件

```env
# 您的私钥 (不包含 0x 前缀)
PRIVATE_KEY=your_private_key_here

# Core 测试网 RPC URL
CORE_TESTNET_RPC_URL=https://rpc.test.btcs.network

# 网络设置
NETWORK=coreTestnet

# 合约地址 (部署后更新)
YAP_TOKEN_ADDRESS=your_deployed_contract_address

# 其他配置
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 3. 安装依赖

```bash
npm install
```

## 🚀 第四步：验证设置

### 1. 验证 Core 测试网设置

```bash
npm run verify:testnet
```

### 2. 检查网络连接

```bash
npm run setup:coreTestnet
```

## 🚀 第五步：部署到 Core 测试网

### 1. 编译合约

```bash
npm run compile
```

### 2. 部署合约

```bash
npm run deploy:coreTestnet
```

### 3. 验证合约

```bash
npm run verify:coreTestnet
```

## 🧪 第六步：测试功能

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

## 📱 第七步：测试前端

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

### 3. 测试钱包连接

1. 打开浏览器访问 http://localhost:3000
2. 确保 MetaMask 已切换到 Core 测试网
3. 连接钱包
4. 测试代币功能

## 🔍 第八步：验证部署

### 1. 检查合约状态

```bash
# 在 Core 测试网浏览器中查看
https://scan.test.btcs.network/address/YOUR_CONTRACT_ADDRESS
```

### 2. 检查代币余额

```bash
# 使用 Hardhat 控制台
npm run console:coreTestnet
```

```javascript
// 在控制台中运行
const YAPToken = await ethers.getContractFactory("YAPToken");
const token = YAPToken.attach("YOUR_CONTRACT_ADDRESS");
const balance = await token.balanceOf("YOUR_WALLET_ADDRESS");
console.log("Balance:", ethers.formatEther(balance));
```

## 🆘 故障排除

### 常见问题

1. **"网络错误"**
   ```bash
   # 检查 RPC 连接
   curl https://rpc.test.btcs.network
   ```

2. **"资金不足"**
   - 确保钱包中有测试网 CORE 代币
   - 使用水龙头获取更多测试代币

3. **"合约验证失败"**
   - 检查合约地址是否正确
   - 确保合约已成功部署

4. **"MetaMask 无法连接"**
   - 确保已正确添加 Core 测试网
   - 检查 Chain ID 是否为 1115

### 调试命令

```bash
# 检查网络状态
npm run setup:coreTestnet

# 获取测试代币
npm run get:tokens

# 验证设置
npm run verify:testnet

# 打开控制台
npm run console:coreTestnet
```

## 📊 测试网信息

### 网络详情
- **Chain ID**: 1115
- **RPC URL**: https://rpc.test.btcs.network
- **浏览器**: https://scan.test.btcs.network
- **水龙头**: https://faucet.test.btcs.network/

### Gas 费用
- 测试网 gas 费用很低
- 通常为 0.0001-0.001 CORE

### 区块时间
- 平均区块时间：约 3-5 秒
- 确认时间：12 个区块

## ✅ 检查清单

- [ ] MetaMask 已添加 Core 测试网
- [ ] 钱包中有测试网 CORE 代币
- [ ] 环境变量已正确配置
- [ ] 合约已部署到测试网
- [ ] 合约已在浏览器上验证
- [ ] 代币转移功能已测试
- [ ] 前端可以正常连接
- [ ] 所有功能都正常工作

## 🎉 完成！

恭喜！您的 Core 测试网设置已完成。现在您可以：

1. 在测试网上安全地测试所有功能
2. 验证合约逻辑
3. 测试前端集成
4. 准备部署到主网

测试完成后，您就可以安全地部署到 Core 主网了！ 