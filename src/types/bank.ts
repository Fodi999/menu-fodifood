// 🏦 Bank API Types

export interface BankStats {
  bank: {
    net_supply: number;
    total_burns: number;
    total_rewards_issued: number;
    total_transactions: number;
    unique_users: number;
  };
  solana: {
    configured: boolean;
    mint_address: string;
    network: string;
  };
  timestamp: string;
}

export interface BankBalance {
  total: number;
  locked: number;
  available: number;
}

export interface FullBalance {
  user_id: string;
  bank_balance: BankBalance;
  solana_balance: number | null;
  total_balance: number;
  network: string;
}

export interface RewardRequest {
  user_id: string;
  amount: number;
  reason: string;
}

export interface RewardResponse {
  success: boolean;
  user_id: string;
  amount: number;
  new_balance: BankBalance;
  reason: string;
}

export interface TransferRequest {
  from_user_id: string;
  to_user_id: string;
  amount: number;
  memo?: string;
}

export interface TransferResponse {
  success: boolean;
  from_user_id: string;
  to_user_id: string;
  amount: number;
  from_new_balance: BankBalance;
  to_new_balance: BankBalance;
  memo?: string;
}
