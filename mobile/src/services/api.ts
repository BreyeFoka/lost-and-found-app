import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  ? 'http://localhost:5000/api'  // Development
  : 'https://your-production-api.com/api';  // Production

const STORAGE_KEYS = {
  TOKEN: '@lost_found_token',
  USER: '@lost_found_user',
};

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
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
    
    // Store token and user data
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    return { user, token };
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    const { user, token } = response.data.data!;
    
    // Store token and user data
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    return { user, token };
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
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

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!token;
  }

  // Get stored user data
  async getStoredUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.api.get('/health');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
