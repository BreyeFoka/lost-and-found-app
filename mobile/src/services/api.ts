import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { 
  ApiResponse, 
  AuthResponse, 
  LoginData, 
  RegisterData, 
  User,
  LostItem,
  FoundItem,
  LostItemForm,
  FoundItemForm,
  ChatRoom,
  Message,
  SearchFilters
} from '../types';

// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3001/api'  // Development
  : 'https://your-production-api.com/api';  // Production

const STORAGE_KEYS = {
  TOKEN: '@lost_found_token',
  USER: '@lost_found_user',
  SESSION_ID: '@lost_found_session',
  REFRESH_TOKEN: '@lost_found_refresh',
};

// Session management
interface SessionInfo {
  id: string;
  lastActivity: number;
  expiresAt: number;
}

class ApiService {
  private api: AxiosInstance;
  private sessionTimer: NodeJS.Timeout | null = null;
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly MAX_RETRY_ATTEMPTS = 3;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.initializeSession();
  }

  // Secure token management
  private async getSecureToken(): Promise<string | null> {
    try {
      // Try to get from secure storage first
      const secureToken = await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
      if (secureToken) return secureToken;
      
      // Fallback to AsyncStorage for backward compatibility
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Error getting secure token:', error);
      return null;
    }
  }

  private async setSecureToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token);
      // Also store in AsyncStorage for backward compatibility
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error('Error setting secure token:', error);
      // Fallback to AsyncStorage only
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    }
  }

  private async removeSecureToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Error removing secure token:', error);
    }
  }

  // Session management
  private async initializeSession(): Promise<void> {
    const token = await this.getSecureToken();
    if (token) {
      await this.updateSessionActivity();
      this.startSessionTimer();
    }
  }

  private async updateSessionActivity(): Promise<void> {
    const now = Date.now();
    const sessionInfo: SessionInfo = {
      id: Math.random().toString(36).substr(2, 9),
      lastActivity: now,
      expiresAt: now + this.SESSION_TIMEOUT
    };
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION_ID, JSON.stringify(sessionInfo));
    } catch (error) {
      console.error('Error updating session activity:', error);
    }
  }

  private startSessionTimer(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
    
    this.sessionTimer = setTimeout(async () => {
      await this.handleSessionTimeout();
    }, this.SESSION_TIMEOUT);
  }

  private async handleSessionTimeout(): Promise<void> {
    console.log('Session timed out, logging out user');
    await this.logout();
  }

  private async isSessionValid(): Promise<boolean> {
    try {
      const sessionData = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_ID);
      if (!sessionData) return false;
      
      const session: SessionInfo = JSON.parse(sessionData);
      return Date.now() < session.expiresAt;
    } catch (error) {
      console.error('Error checking session validity:', error);
      return false;
    }
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token and session management
    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getSecureToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Update session activity
        await this.updateSessionActivity();
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication Methods
  async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    const { user, token } = response.data.data!;
    
    // Store token and user data securely
    await this.setSecureToken(token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    // Initialize session
    await this.initializeSession();
    
    return { user, token };
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    const { user, token } = response.data.data!;
    
    // Store token and user data securely
    await this.setSecureToken(token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    // Initialize session
    await this.initializeSession();
    
    return { user, token };
  }

  async logout(): Promise<void> {
    // Clear session timer
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
    
    // Remove all stored data
    await this.removeSecureToken();
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER, 
      STORAGE_KEYS.SESSION_ID, 
      STORAGE_KEYS.REFRESH_TOKEN
    ]);
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get<ApiResponse<{ user: User }>>('/auth/profile');
    return response.data.data!.user;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await this.api.put<ApiResponse<{ user: User }>>('/users/profile', userData);
    const user = response.data.data!.user;
    
    // Update stored user data
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    return user;
  }

  // Lost Items Methods
  async getLostItems(filters?: SearchFilters): Promise<LostItem[]> {
    const params = this.buildSearchParams(filters);
    const response = await this.api.get<ApiResponse<LostItem[]>>('/lost-items', { params });
    return response.data.data!;
  }

  async getLostItem(id: string): Promise<LostItem> {
    const response = await this.api.get<ApiResponse<LostItem>>(`/lost-items/${id}`);
    return response.data.data!;
  }

  async createLostItem(itemData: LostItemForm): Promise<LostItem> {
    const formData = this.createFormData(itemData);
    const response = await this.api.post<ApiResponse<LostItem>>('/lost-items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data!;
  }

  async updateLostItem(id: string, itemData: Partial<LostItemForm>): Promise<LostItem> {
    const formData = this.createFormData(itemData);
    const response = await this.api.put<ApiResponse<LostItem>>(`/lost-items/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data!;
  }

  async deleteLostItem(id: string): Promise<void> {
    await this.api.delete(`/lost-items/${id}`);
  }

  // Found Items Methods
  async getFoundItems(filters?: SearchFilters): Promise<FoundItem[]> {
    const params = this.buildSearchParams(filters);
    const response = await this.api.get<ApiResponse<FoundItem[]>>('/found-items', { params });
    return response.data.data!;
  }

  async getFoundItem(id: string): Promise<FoundItem> {
    const response = await this.api.get<ApiResponse<FoundItem>>(`/found-items/${id}`);
    return response.data.data!;
  }

  async createFoundItem(itemData: FoundItemForm): Promise<FoundItem> {
    const formData = this.createFormData(itemData);
    const response = await this.api.post<ApiResponse<FoundItem>>('/found-items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data!;
  }

  async updateFoundItem(id: string, itemData: Partial<FoundItemForm>): Promise<FoundItem> {
    const formData = this.createFormData(itemData);
    const response = await this.api.put<ApiResponse<FoundItem>>(`/found-items/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data!;
  }

  async deleteFoundItem(id: string): Promise<void> {
    await this.api.delete(`/found-items/${id}`);
  }

  // Chat Methods
  async getChatRooms(): Promise<ChatRoom[]> {
    const response = await this.api.get<ApiResponse<ChatRoom[]>>('/chat/rooms');
    return response.data.data!;
  }

  async createChatRoom(data: { lostItemId?: string; foundItemId?: string }): Promise<ChatRoom> {
    const response = await this.api.post<ApiResponse<ChatRoom>>('/chat/rooms', data);
    return response.data.data!;
  }

  async getChatMessages(roomId: string, page = 1, limit = 50): Promise<Message[]> {
    const response = await this.api.get<ApiResponse<Message[]>>(`/chat/rooms/${roomId}/messages`, {
      params: { page, limit }
    });
    return response.data.data!;
  }

  // Utility Methods
  private buildSearchParams(filters?: SearchFilters): Record<string, any> {
    if (!filters) return {};
    
    const params: Record<string, any> = {};
    
    if (filters.query) params.q = filters.query;
    if (filters.category) params.category = filters.category;
    if (filters.location) params.location = filters.location;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom.toISOString();
    if (filters.dateTo) params.dateTo = filters.dateTo.toISOString();
    
    return params;
  }

  private createFormData(data: any): FormData {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (key === 'images' && Array.isArray(data[key])) {
        data[key].forEach((image: string, index: number) => {
          formData.append('images', {
            uri: image,
            type: 'image/jpeg',
            name: `image_${index}.jpg`,
          } as any);
        });
      } else if (data[key] instanceof Date) {
        formData.append(key, data[key].toISOString());
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key].toString());
      }
    });
    
    return formData;
  }

  // Check if user is authenticated with enhanced security
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getSecureToken();
    if (!token) return false;
    
    // Check session validity
    const sessionValid = await this.isSessionValid();
    if (!sessionValid) {
      await this.logout();
      return false;
    }
    
    // Restart session timer
    this.startSessionTimer();
    
    return true;
  }

  // Get stored user data
  async getStoredUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }

  // Enhanced health check with security validation
  async healthCheck(): Promise<{ status: string; timestamp: string; secure: boolean }> {
    const response = await this.api.get('/health');
    const isSecure = await this.isAuthenticated();
    return { ...response.data, secure: isSecure };
  }
}

export const apiService = new ApiService();
export default apiService;
