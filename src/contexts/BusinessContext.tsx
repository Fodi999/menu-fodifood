'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Business } from '@/types/business';
import { businessesApi } from '@/lib/rust-api';

interface BusinessContextType {
  currentBusiness: Business | null;
  setCurrentBusiness: (business: Business | null) => void;
  isLoading: boolean;
  error: string | null;
  refreshBusiness: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

interface BusinessProviderProps {
  children: ReactNode;
  initialBusinessId?: string;
}

export function BusinessProvider({ children, initialBusinessId }: BusinessProviderProps) {
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузить бизнес при монтировании (если есть ID в user.business_id)
  useEffect(() => {
    if (initialBusinessId) {
      loadBusiness(initialBusinessId);
    }
  }, [initialBusinessId]);

  const loadBusiness = async (businessId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const business = await businessesApi.getById(businessId);
      setCurrentBusiness(business);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load business');
      console.error('Failed to load business:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBusiness = async () => {
    if (currentBusiness) {
      await loadBusiness(currentBusiness.id);
    }
  };

  return (
    <BusinessContext.Provider
      value={{
        currentBusiness,
        setCurrentBusiness,
        isLoading,
        error,
        refreshBusiness,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
