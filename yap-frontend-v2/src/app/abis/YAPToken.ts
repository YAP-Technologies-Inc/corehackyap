export const tokenAbi = [
  // ERC20 标准函数
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  
  // YAP Token 特定函数
  "function mint(address to, uint256 amount)",
  "function burn(uint256 amount)",
  "function owner() view returns (address)",
  
  // 事件
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event Mint(address indexed to, uint256 amount)",
  "event Burn(address indexed from, uint256 amount)"
];

// Core 区块链网络配置
export const coreNetworkConfig = {
  chainId: 1116,
  chainName: "Core",
  nativeCurrency: {
    name: "CORE",
    symbol: "CORE",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.coredao.org"],
  blockExplorerUrls: ["https://scan.coredao.org"],
};

// Core 测试网配置
export const coreTestnetConfig = {
  chainId: 1115,
  chainName: "Core Testnet",
  nativeCurrency: {
    name: "CORE",
    symbol: "CORE",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.test.btcs.network"],
  blockExplorerUrls: ["https://scan.test.btcs.network"],
};