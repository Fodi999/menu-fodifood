'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';

export function AnalyticsTracker() {
  useEffect(() => {
    // Track page visit on mount
    analytics.trackVisit();
  }, []);

  return null; // This component doesn't render anything
}
