"use client";

import { useState, useEffect } from "react";

interface WalletState {
  address: string | null;
  balance: number;
  isConnected: boolean;
}

/**
 * Hook для Web3 подключения кошелька (mock версия)
 * В реальном проекте здесь будет интеграция с Web3.js/Ethers.js
 */
export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    balance: 0,
    isConnected: false,
  });
  const [isConnecting, setIsConnecting] = useState(false);

  // Проверка подключения при загрузке
  useEffect(() => {
    const savedWallet = localStorage.getItem("fodi_wallet");
    if (savedWallet) {
      try {
        const parsed = JSON.parse(savedWallet);
        setWallet(parsed);
      } catch (e) {
        console.error("Failed to parse wallet data:", e);
      }
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);

    // Симуляция подключения (в реальности здесь будет MetaMask/WalletConnect)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock данные
    const mockAddress = "0x" + Math.random().toString(16).substr(2, 40);
    const mockBalance = Math.floor(Math.random() * 10000) + 1000;

    const newWallet = {
      address: mockAddress,
      balance: mockBalance,
      isConnected: true,
    };

    setWallet(newWallet);
    localStorage.setItem("fodi_wallet", JSON.stringify(newWallet));
    setIsConnecting(false);
  };

  const disconnectWallet = () => {
    setWallet({
      address: null,
      balance: 0,
      isConnected: false,
    });
    localStorage.removeItem("fodi_wallet");
  };

  return {
    ...wallet,
    isConnecting,
    connectWallet,
    disconnectWallet,
  };
}
