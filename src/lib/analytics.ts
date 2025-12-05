/**
 * Analytics Service
 * Tracks user activity on the website
 */

export interface AnalyticsData {
  totalVisits: number;
  totalOrders: number;
  totalCartItems: number;
  totalMenuViews: number;
  lastVisit: string;
  firstVisit: string;
}

const ANALYTICS_KEY = 'fodifood_analytics';

class AnalyticsService {
  private data: AnalyticsData;

  constructor() {
    this.data = this.load();
  }

  /**
   * Load analytics data from localStorage
   */
  private load(): AnalyticsData {
    if (typeof window === 'undefined') {
      return this.getDefaultData();
    }

    try {
      const stored = localStorage.getItem(ANALYTICS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }

    return this.getDefaultData();
  }

  /**
   * Get default analytics data
   */
  private getDefaultData(): AnalyticsData {
    return {
      totalVisits: 0,
      totalOrders: 0,
      totalCartItems: 0,
      totalMenuViews: 0,
      lastVisit: new Date().toISOString(),
      firstVisit: new Date().toISOString(),
    };
  }

  /**
   * Save analytics data to localStorage
   */
  private save(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save analytics:', error);
    }
  }

  /**
   * Track a page visit
   */
  trackVisit(): void {
    this.data.totalVisits++;
    this.data.lastVisit = new Date().toISOString();
    this.save();
  }

  /**
   * Track an order
   */
  trackOrder(): void {
    this.data.totalOrders++;
    this.save();
  }

  /**
   * Track menu view
   */
  trackMenuView(): void {
    this.data.totalMenuViews++;
    this.save();
  }

  /**
   * Update cart items count
   */
  updateCartItems(count: number): void {
    this.data.totalCartItems = count;
    this.save();
  }

  /**
   * Get current analytics data
   */
  getData(): AnalyticsData {
    return { ...this.data };
  }

  /**
   * Reset analytics (for testing)
   */
  reset(): void {
    this.data = this.getDefaultData();
    this.save();
  }
}

export const analytics = new AnalyticsService();
