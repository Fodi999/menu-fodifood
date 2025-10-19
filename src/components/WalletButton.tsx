"use client";

import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export function WalletButton() {
  const { address, balance, isConnected, isConnecting, connectWallet, disconnectWallet } = useWallet();

  if (isConnected && address) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2"
      >
        {/* Balance Display */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 backdrop-blur-sm">
          <Wallet className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-semibold text-orange-300">
            {balance.toLocaleString()} FODI
          </span>
        </div>

        {/* Address Display + Disconnect */}
        <Button
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
          className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300 relative group"
        >
          <span className="hidden sm:inline">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <span className="sm:hidden">Wallet</span>
          <LogOut className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </motion.div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="relative bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold shadow-lg hover:shadow-orange-500/50 transition-all duration-300"
    >
      {isConnecting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Подключение...
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </>
      )}
      
      {/* Pulsing glow effect */}
      {!isConnecting && (
        <motion.div
          className="absolute inset-0 rounded-md bg-gradient-to-r from-orange-500 to-yellow-500 opacity-0 blur-xl"
          animate={{
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </Button>
  );
}
