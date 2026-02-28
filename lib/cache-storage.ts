'use client';

/**
 * Client-side cache storage using localStorage
 * Stores user data, tokens, predictions, appointments, and doctors
 */

const CACHE_KEYS = {
  USER: 'liver_disease_user',
  TOKEN: 'liver_disease_token',
  PREDICTIONS: 'liver_disease_predictions',
  APPOINTMENTS: 'liver_disease_appointments',
  DOCTORS: 'liver_disease_doctors',
  HEALTH_RECORDS: 'liver_disease_health_records',
};

const CACHE_DURATION = {
  USER: 24 * 60 * 60 * 1000, // 24 hours
  TOKEN: 7 * 24 * 60 * 60 * 1000, // 7 days
  PREDICTIONS: 7 * 24 * 60 * 60 * 1000, // 7 days
  APPOINTMENTS: 7 * 24 * 60 * 60 * 1000, // 7 days
  DOCTORS: 24 * 60 * 60 * 1000, // 24 hours
  HEALTH_RECORDS: 30 * 24 * 60 * 60 * 1000, // 30 days
};

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export const cacheStorage = {
  // Generic get/set
  get<T>(key: string): T | null {
    if (!isClient()) return null;

    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed: CacheItem<T> = JSON.parse(item);
      return parsed.data;
    } catch (error) {
      console.error('[v0] Cache get error:', error);
      return null;
    }
  },

  set<T>(key: string, data: T, duration?: number): void {
    if (!isClient()) return;

    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now() + (duration || 24 * 60 * 60 * 1000),
      };
      localStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('[v0] Cache set error:', error);
    }
  },

  remove(key: string): void {
    if (!isClient()) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('[v0] Cache remove error:', error);
    }
  },

  clear(): void {
    if (!isClient()) return;
    try {
      Object.values(CACHE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('[v0] Cache clear error:', error);
    }
  },

  // User operations
  setUser(user: any): void {
    this.set('liver_disease_user', user, CACHE_DURATION.USER);
  },

  getUser(): any {
    return this.get('liver_disease_user');
  },

  // Token operations
  setToken(token: string): void {
    this.set('liver_disease_token', token, CACHE_DURATION.TOKEN);
  },

  getToken(): string | null {
    return this.get('liver_disease_token');
  },

  // Predictions operations
  setPredictions(predictions: any[]): void {
    this.set('liver_disease_predictions', predictions, CACHE_DURATION.PREDICTIONS);
  },

  getPredictions(): any[] {
    return this.get('liver_disease_predictions') || [];
  },

  // Appointments operations
  setAppointments(appointments: any[]): void {
    this.set('liver_disease_appointments', appointments, CACHE_DURATION.APPOINTMENTS);
  },

  getAppointments(): any[] {
    return this.get('liver_disease_appointments') || [];
  },

  // Doctors operations
  setDoctors(doctors: any[]): void {
    this.set('liver_disease_doctors', doctors, CACHE_DURATION.DOCTORS);
  },

  getDoctors(): any[] {
    return this.get('liver_disease_doctors') || [];
  },

  // Health records operations
  setHealthRecords(records: any[]): void {
    this.set('liver_disease_health_records', records, CACHE_DURATION.HEALTH_RECORDS);
  },

  getHealthRecords(): any[] {
    return this.get('liver_disease_health_records') || [];
  },
};

export default cacheStorage;
