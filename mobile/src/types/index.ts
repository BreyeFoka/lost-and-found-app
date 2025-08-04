import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  studentId?: string;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  studentId?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Item Types
export type ItemCategory = 
  | 'electronics'
  | 'books'
  | 'clothing'
  | 'accessories'
  | 'keys'
  | 'documents'
  | 'sports'
  | 'other';

export interface BaseItem {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  location: string;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface LostItem extends BaseItem {
  dateLost: string;
}

export interface FoundItem extends BaseItem {
  dateFound: string;
}

// Chat Types
export interface ChatRoom {
  id: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lostItemId?: string;
  foundItemId?: string;
  lostItem?: LostItem;
  foundItem?: FoundItem;
  participants: ChatRoomParticipant[];
  lastMessage?: Message;
}

export interface ChatRoomParticipant {
  id: string;
  userId: string;
  chatRoomId: string;
  joinedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export type MessageType = 'TEXT' | 'IMAGE' | 'SYSTEM';

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  isRead: boolean;
  createdAt: string;
  userId: string;
  chatRoomId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

// Form Types
export interface LostItemForm {
  title: string;
  description: string;
  category: ItemCategory;
  location: string;
  dateLost: Date;
  images: string[];
}

export interface FoundItemForm {
  title: string;
  description: string;
  category: ItemCategory;
  location: string;
  dateFound: Date;
  images: string[];
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  AddItem: { itemType?: 'lost' | 'found' };
  ItemDetails: { itemId: string; itemType: 'lost' | 'found' };
  Chat: { roomId: string };
  EditProfile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Lost: undefined;
  Found: undefined;
  Chat: undefined;
  Profile: undefined;
};

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  category?: ItemCategory;
  dateFrom?: Date;
  dateTo?: Date;
  location?: string;
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
}

// Navigation Props
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

export type LoginStackNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;
export type RegisterStackNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;
