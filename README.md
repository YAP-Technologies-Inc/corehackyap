# YAP Integration

这个仓库包含了 YAP 项目的前端 (Next.js) 和后端 (Node.js)。

## 项目结构

- `yap-frontend-v2 copy/` — Next.js 15 前端 (React 19, TailwindCSS 4)
- `YAPBackend copy/` — Node.js 后端 (Express, ethers, 等)

## 功能特性

### 🪙 代币奖励系统
- 学生完成课程后获得 YAP 代币奖励
- 使用 AI 对话功能需要消费 YAP 代币
- 基于 Sei 测试网的智能合约

### 🔗 MetaMask 钱包集成
- 支持 MetaMask 钱包连接
- 自动切换到 Sei 测试网
- 实时显示代币余额

### 🎓 学习系统
- 西班牙语课程学习
- 课程完成进度跟踪
- 每日学习统计

---

## 快速开始

### 1. 克隆仓库
```sh
git clone https://github.com/YAP-Technologies-Inc/yap-integration.git
cd yap-integration
```

### 2. 安装依赖
#### 后端
```sh
cd "YAPBackend copy"
npm install
```
#### 前端
```sh
cd "yap-frontend-v2 copy"
npm install
```

### 3. 环境变量配置
**不要提交你的 `.env` 文件。**
- `.env` 文件已在 `.gitignore` 中，不会上传到 GitHub
- 将你的 `.env` 文件放在相应文件夹中：
  - `YAPBackend copy/.env`
  - `yap-frontend-v2 copy/.env`

#### 前端环境变量示例
```env
# YAP 代币合约地址 (Sei 测试网)
NEXT_PUBLIC_TOKEN_ADDRESS=0x47423334c145002467a24bA1B41Ac93e2f503cc6

# 后端 API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# 其他配置
NEXT_PUBLIC_APP_NAME=YAP Language Learning
```

#### 后端环境变量示例
```env
# 数据库配置
DB_USER=postgres
DB_HOST=localhost
DB_NAME=yapdb
DB_PASSWORD=your_password
DB_PORT=5432

# 区块链配置
PRIVATE_KEY=your_private_key
TOKEN_ADDRESS=0x47423334c145002467a24bA1B41Ac93e2f503cc6
SEI_RPC=https://evm-rpc-testnet.sei-apis.com
```

### 4. 运行项目
#### 后端
```sh
cd "YAPBackend copy"
node index.js
```
#### 前端
```sh
cd "yap-frontend-v2 copy"
npm run dev
```
- 前端通常运行在 [http://localhost:3000](http://localhost:3000)

---

## 使用说明

### 1. 连接 MetaMask 钱包
1. 确保已安装 MetaMask 浏览器扩展
2. 点击"连接 MetaMask"按钮
3. 授权连接并切换到 Sei 测试网

### 2. 学习课程获得代币
1. 选择并完成课程
2. 系统自动发送 1 YAP 代币到你的钱包
3. 在主页查看代币余额

### 3. 使用 AI 对话功能
1. 确保钱包中有足够的 YAP 代币
2. 点击"与西班牙语老师对话"
3. 系统会消费 1 YAP 代币用于 AI 对话

---

## Git 使用
- 你的 `.env` 文件受 `.gitignore` 保护，不会上传
- 提交和推送更改：
```sh
git add .
git commit -m "你的消息"
git push
```
- 如果需要强制推送 (覆盖远程)：
```sh
git push -u origin main --force
```
  **警告：** 这将用你的本地分支覆盖远程分支。

---

## 注意事项
- 如果看到 `Module not found: Can't resolve '@11labs/react'`，在前端安装：
  ```sh
  cd "yap-frontend-v2 copy"
  npm install @11labs/react
  ```
- 确保 MetaMask 已安装并配置 Sei 测试网
- 如有问题，请查看文档或在此仓库中提出 issue

---

## 许可证
[MIT](LICENSE) 