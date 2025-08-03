'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { tokenAbi, coreNetworkConfig, coreTestnetConfig } from '../app/abis/YAPToken';

export const useYAPToken = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState<string>('');

  // 初始化提供者和合约
  useEffect(() => {
    const initProvider = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);

          // 检查当前网络
          const network = await provider.getNetwork();
          setNetwork(network.name);

          // 检查是否连接到 Core 区块链
          if (network.chainId === BigInt(1116)) {
            console.log('✅ 已连接到 Core 主网');
          } else if (network.chainId === BigInt(1115)) {
            console.log('✅ 已连接到 Core 测试网');
          } else {
            console.log('⚠️ 请切换到 Core 区块链网络');
          }

          // 获取签名者
          const signer = await provider.getSigner();
          setSigner(signer);

          // 获取当前账户
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0].address);
            setIsConnected(true);
          }

          // 初始化合约
          const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
          if (tokenAddress) {
            const contract = new ethers.Contract(tokenAddress, tokenAbi, signer);
            setContract(contract);
          }

        } catch (error) {
          console.error('初始化提供者失败:', error);
        }
      }
    };

    initProvider();
  }, []);

  // 监听账户变化
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount(null);
          setIsConnected(false);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // 更新余额
  useEffect(() => {
    const updateBalance = async () => {
      if (contract && account) {
        try {
          const balance = await contract.balanceOf(account);
          setBalance(ethers.formatEther(balance));
        } catch (error) {
          console.error('获取余额失败:', error);
        }
      }
    };

    updateBalance();
  }, [contract, account]);

  // 连接到钱包
  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error('连接钱包失败:', error);
      }
    }
  };

  // 切换到 Core 区块链
  const switchToCore = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x45C' }], // 1116 in hex
        });
      } catch (switchError: any) {
        // 如果网络不存在，添加网络
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [coreNetworkConfig],
            });
          } catch (addError) {
            console.error('添加 Core 网络失败:', addError);
          }
        }
      }
    }
  };

  // 切换到 Core 测试网
  const switchToCoreTestnet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x45B' }], // 1115 in hex
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [coreTestnetConfig],
            });
          } catch (addError) {
            console.error('添加 Core 测试网失败:', addError);
          }
        }
      }
    }
  };

  // 转移代币
  const transferTokens = async (to: string, amount: string) => {
    if (contract && signer) {
      try {
        const tx = await contract.transfer(to, ethers.parseEther(amount));
        await tx.wait();
        console.log('✅ 转移成功');
        return true;
      } catch (error) {
        console.error('转移失败:', error);
        return false;
      }
    }
    return false;
  };

  // 铸造代币 (仅所有者)
  const mintTokens = async (to: string, amount: string) => {
    if (contract && signer) {
      try {
        const tx = await contract.mint(to, ethers.parseEther(amount));
        await tx.wait();
        console.log('✅ 铸造成功');
        return true;
      } catch (error) {
        console.error('铸造失败:', error);
        return false;
      }
    }
    return false;
  };

  // 销毁代币
  const burnTokens = async (amount: string) => {
    if (contract && signer) {
      try {
        const tx = await contract.burn(ethers.parseEther(amount));
        await tx.wait();
        console.log('✅ 销毁成功');
        return true;
      } catch (error) {
        console.error('销毁失败:', error);
        return false;
      }
    }
    return false;
  };

  return {
    contract,
    provider,
    signer,
    account,
    balance,
    isConnected,
    network,
    connectWallet,
    switchToCore,
    switchToCoreTestnet,
    transferTokens,
    mintTokens,
    burnTokens,
  };
}; 