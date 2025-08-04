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
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  ItemDetails: { itemId: string; type: 'lost' | 'found' };
  ReportLost: undefined;
  ReportFound: undefined;
  Chat: { roomId: string };
  Profile: undefined;
  EditProfile: undefined;
};

export type TabParamList = {
  Home: undefined;
  Lost: undefined;
  Found: undefined;
  Report: undefined;
  Chats: undefined;
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
