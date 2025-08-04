# 📱 Lost & Found - Student Community App

> **Connecting students to reunite them with their lost belongings through technology**

A comprehensive mobile application built with React Native Expo and Node.js that helps students find their lost items by creating a community-driven platform where users can report lost items, post found items, and communicate directly through real-time chat to coordinate returns.

## 💡 The App Idea

### Problem Statement
Students frequently lose personal items on campus - from textbooks and laptops to keys and wallets. Currently, there's no efficient, centralized system for students to:
- Report lost items with detailed descriptions and photos
- Browse found items that others have discovered
- Communicate securely with finders/losers to arrange returns
- Search through historical reports to find matches

### Our Solution
The Lost & Found app creates a digital community where students can:

🔍 **Report Lost Items** - Upload photos, descriptions, last known location, and contact preferences  
📍 **Post Found Items** - Help others by posting items you've discovered with location details  
💬 **Real-time Chat** - Secure messaging system to coordinate item returns privately  
🔔 **Smart Notifications** - Get alerted when potential matches are found  
📱 **Mobile-First Design** - Native mobile experience optimized for quick posting and browsing  
🔒 **Secure & Private** - Student verification and secure authentication protect user data  

### Key Features

#### For Students Who Lost Items:
- Quick item reporting with camera integration
- Detailed categorization (electronics, books, clothing, etc.)
- Location mapping of where item was last seen
- Photo uploads for visual identification
- Privacy controls for contact information
- Status tracking (lost → found → returned)

#### For Students Who Found Items:
- Easy posting of discovered items
- Photo documentation with timestamp
- Location tracking of where item was found
- Option to hand items to campus security
- Communication tools to verify ownership

#### For Everyone:
- Advanced search and filtering by category, date, location
- Real-time chat system for secure communication
- Push notifications for matches and messages
- University integration for campus-specific deployments
- Reputation system to build community trust

## 🛠️ Technology Stack & Tools

### Frontend (Mobile App)

**Core Framework:**
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools for React Native
- **TypeScript** - Type safety and enhanced development experience

**Navigation & UI:**
- **React Navigation 6** - Native navigation with stack and tab navigators
- **React Native Safe Area Context** - Handle device safe areas
- **Expo Vector Icons** - Comprehensive icon library

**Device Integration:**
- **Expo Camera** - Camera functionality for photo capture
- **Expo Image Picker** - Photo selection from device gallery
- **Expo Location** - GPS location services for item mapping

**Data & Communication:**
- **Axios** - HTTP client for API requests
- **Socket.io Client** - Real-time bidirectional communication
- **AsyncStorage** - Local data persistence
- **React Hook Form** - Form handling and validation

### Backend (API)

**Core Framework:**
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Web application framework
- **TypeScript** - Type safety across the entire backend

**Database & ORM:**
- **PostgreSQL** - Robust relational database
- **Prisma ORM** - Modern database toolkit with type safety
- **Prisma Studio** - Visual database browser and editor

**Authentication & Security:**
- **JSON Web Tokens (JWT)** - Stateless authentication
- **bcryptjs** - Password hashing and encryption
- **Helmet.js** - HTTP security headers
- **CORS** - Cross-origin resource sharing configuration
- **Express Rate Limit** - API rate limiting to prevent abuse

**Real-time & File Handling:**
- **Socket.io** - Real-time WebSocket communication
- **Multer** - File upload middleware for image handling
- **UUID** - Unique identifier generation

**Logging & Monitoring:**
- **Winston** - Comprehensive logging library
- **Morgan** - HTTP request logger middleware

**Development Tools:**
- **Nodemon** - Auto-restart server during development
- **ts-node** - TypeScript execution for Node.js
- **Express Validator** - Input validation and sanitization

### Development Environment

**Code Quality:**
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

**Version Control:**
- **Git** - Source code management
- **GitHub** - Remote repository hosting
- **GitHub Actions** - CI/CD pipeline (planned)

**API Development:**
- **REST API** - RESTful architecture principles
- **OpenAPI/Swagger** - API documentation (planned)
- **Postman** - API testing and development

## 🏗️ System Architecture

### Database Schema

```sql
Users (Authentication & Profiles)
├── id (Primary Key)
├── email (Unique)
├── password (Hashed)
├── firstName, lastName
├── studentId (Optional, Unique)
├── phone, avatar
└── isVerified, timestamps

Lost Items
├── id (Primary Key)
├── userId (Foreign Key → Users)
├── title, description, category
├── location, dateLost
├── images[] (Array of image URLs)
├── isActive (Boolean)
└── timestamps

Found Items
├── id (Primary Key)
├── userId (Foreign Key → Users)
├── title, description, category
├── location, dateFound
├── images[] (Array of image URLs)
├── isActive (Boolean)
└── timestamps

Chat Rooms
├── id (Primary Key)
├── lostItemId (Optional FK → Lost Items)
├── foundItemId (Optional FK → Found Items)
├── participants[] (Many-to-Many → Users)
└── timestamps

Messages
├── id (Primary Key)
├── chatRoomId (Foreign Key → Chat Rooms)
├── userId (Foreign Key → Users)
├── content, type (TEXT/IMAGE/SYSTEM)
├── isRead (Boolean)
└── timestamp
```

### API Architecture

**RESTful Endpoints:**
- `GET /api/health` - System health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/profile` - Get user profile
- `GET /api/lost-items` - Browse lost items
- `POST /api/lost-items` - Report lost item
- `GET /api/found-items` - Browse found items  
- `POST /api/found-items` - Report found item
- `GET /api/chat/rooms` - Get user's chat rooms
- `POST /api/chat/rooms` - Create new chat room

**Real-time Features:**
- WebSocket connection for instant messaging
- Live notifications for new matches
- Typing indicators in chat rooms
- Real-time item status updates

## Project Structure

```
losts/
├── mobile/                 # React Native Expo app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── screens/        # App screens
│   │   ├── navigation/     # Navigation setup
│   │   ├── services/       # API and socket services
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── package.json
├── backend/                # Node.js API server
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── server.ts       # Main server file
│   ├── prisma/             # Database schema and migrations
│   ├── uploads/            # File upload directory
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Package manager (comes with Node.js)
- **PostgreSQL** (v12 or higher) - [Download here](https://postgresql.org/)
- **Expo CLI** - Install globally: `npm install -g @expo/cli`
- **Git** - For version control
- **Android Studio** (for Android development) or **Xcode** (for iOS development, macOS only)

### 📋 Quick Setup Guide

#### 1. Clone the Repository
```bash
git clone https://github.com/BreyeFoka/lost-and-found-app.git
cd lost-and-found-app
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Edit .env file with your configuration:
# DATABASE_URL="postgresql://username:password@localhost:5432/lost_and_found_db"
# JWT_SECRET="your-super-secret-jwt-key"
# PORT=5000

# Create database and run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Start development server
npm run dev
```

#### 3. Mobile App Setup

```bash
# Navigate to mobile directory (in a new terminal)
cd mobile

# Install dependencies
npm install

# Start Expo development server
npm start

# Choose your platform:
# - Press 'a' for Android
# - Press 'i' for iOS (macOS only)
# - Press 'w' for web browser
# - Scan QR code with Expo Go app on your device
```

### 🔧 Configuration Details

#### Environment Variables (Backend)

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/lost_and_found_db?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif

# Email Configuration (Optional - for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### Database Setup

1. **Install PostgreSQL** and create a new database:
```sql
CREATE DATABASE lost_and_found_db;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE lost_and_found_db TO your_username;
```

2. **Update DATABASE_URL** in your `.env` file with your actual credentials

3. **Run migrations** to create tables:
```bash
npm run db:migrate
```

#### Mobile App Configuration

The mobile app automatically connects to your backend server. Update the API base URL in the app configuration if needed:

```typescript
// mobile/src/services/api.ts
const API_BASE_URL = 'http://localhost:5000/api';  // Development
// const API_BASE_URL = 'https://your-production-api.com/api';  // Production
```

## 🔍 Detailed Usage

### For Developers

#### Available Scripts

**Backend Development:**
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio (visual database browser)
npm run db:push      # Push schema changes to database
```

**Mobile App Development:**
```bash
npm start           # Start Expo development server
npm run android     # Run on Android device/emulator
npm run ios         # Run on iOS device/simulator (macOS only)
npm run web         # Run in web browser
npm run eject       # Eject from Expo (advanced users only)
```

#### Development Workflow

1. **Backend Development:**
   - Start the backend server: `npm run dev`
   - Use Prisma Studio to view/edit database: `npm run db:studio`
   - Check logs in `backend/logs/` directory
   - API documentation available at `/health` endpoint

2. **Mobile Development:**
   - Start Expo server: `npm start`
   - Use Expo Go app on your phone for live testing
   - Enable hot reload for instant updates
   - Use React Developer Tools for debugging

3. **Database Changes:**
   - Modify `backend/prisma/schema.prisma`
   - Run `npm run db:migrate` to create migration
   - Run `npm run db:generate` to update Prisma client

### For End Users

#### How to Use the App

1. **Registration:**
   - Download the app or access via web
   - Register with your student email
   - Verify your account (optional student ID)

2. **Reporting Lost Items:**
   - Tap "Report Lost Item"
   - Add photos, description, and category
   - Mark the last known location
   - Set privacy preferences for contact

3. **Posting Found Items:**
   - Tap "Post Found Item"
   - Upload photos with timestamp
   - Describe where you found it
   - Wait for potential owners to contact you

4. **Searching & Communication:**
   - Browse items by category or search
   - Filter by date, location, or keywords
   - Start a chat with item reporters
   - Arrange safe meetups for returns

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt encryption for user passwords
- **Input Validation** - Server-side validation for all inputs
- **Rate Limiting** - API rate limiting to prevent abuse
- **CORS Protection** - Cross-origin request configuration
- **File Upload Security** - File type and size restrictions
- **SQL Injection Prevention** - Prisma ORM with parameterized queries
- **XSS Protection** - Input sanitization and content security policies

## 📊 API Documentation

### Core Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

#### Lost Items
- `GET /api/lost-items` - Get all lost items
- `POST /api/lost-items` - Create lost item report
- `GET /api/lost-items/:id` - Get specific lost item
- `PUT /api/lost-items/:id` - Update lost item
- `DELETE /api/lost-items/:id` - Delete lost item

#### Found Items
- `GET /api/found-items` - Get all found items
- `POST /api/found-items` - Create found item report
- `GET /api/found-items/:id` - Get specific found item
- `PUT /api/found-items/:id` - Update found item
- `DELETE /api/found-items/:id` - Delete found item

#### Chat & Communication
- `GET /api/chat/rooms` - Get user's chat rooms
- `POST /api/chat/rooms` - Create new chat room
- `GET /api/chat/rooms/:id/messages` - Get chat messages

#### System
- `GET /health` - API health check and status

## 🗄️ Database Design

The application uses PostgreSQL with the following main entities:

- **Users**: Student profiles with authentication and verification
- **LostItems**: Items that have been lost with photos and location data
- **FoundItems**: Items that have been found with documentation
- **ChatRooms**: Communication channels between users for item coordination
- **Messages**: Real-time chat messages with timestamp and read status
- **Reports**: Content moderation and abuse reporting system

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Process

1. **Fork the repository** on GitHub
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/amazing-new-feature
   ```
3. **Make your changes** with proper commit messages
4. **Add tests** for new functionality
5. **Ensure code quality**:
   ```bash
   npm run lint        # Check code style
   npm run type-check  # Verify TypeScript
   npm test           # Run test suite
   ```
6. **Submit a pull request** with a clear description

### Areas for Contribution

- 🎨 **UI/UX Improvements** - Enhance mobile app design and user experience
- 🔧 **Backend Features** - Add new API endpoints and functionality
- 🔒 **Security Enhancements** - Improve authentication and data protection
- 📱 **Mobile Features** - Add push notifications, offline support, etc.
- 🧪 **Testing** - Write unit tests and integration tests
- 📖 **Documentation** - Improve guides and API documentation
- 🌐 **Localization** - Add support for multiple languages

### Code Style Guidelines

- Use **TypeScript** throughout the codebase
- Follow **ESLint** and **Prettier** configurations
- Write **descriptive commit messages**
- Add **JSDoc comments** for functions and classes
- Keep **components small** and focused on single responsibility
- Use **proper error handling** and logging

## 🚀 Deployment

### Production Setup

#### Backend Deployment (Node.js)

**Recommended Platforms:**
- **Heroku** - Easy deployment with PostgreSQL add-on
- **DigitalOcean App Platform** - Scalable with managed databases
- **AWS EC2** - Full control with RDS for database
- **Railway** - Modern deployment platform

**Environment Variables for Production:**
```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
JWT_SECRET=your_very_secure_jwt_secret
FRONTEND_URL=https://your-app-domain.com
```

#### Mobile App Deployment

**App Store Deployment:**
```bash
# Build for production
expo build:ios          # iOS App Store
expo build:android      # Google Play Store

# Or using EAS Build (recommended)
eas build --platform ios
eas build --platform android
```

**Web Deployment:**
```bash
# Build web version
expo build:web

# Deploy to Netlify, Vercel, or any static hosting
```

## 🔮 Future Roadmap

### Short-term Goals (Next 3 months)
- [ ] Push notifications for item matches and messages
- [ ] Advanced search filters (date range, proximity, category)
- [ ] User profile verification system
- [ ] Image recognition for automatic item categorization
- [ ] Offline support for viewing cached items

### Medium-term Goals (3-6 months)
- [ ] University integration and campus-specific deployments
- [ ] Admin dashboard for content moderation
- [ ] Reputation and rating system for users
- [ ] QR code generation for quick item reporting
- [ ] Integration with campus security systems

### Long-term Vision (6+ months)
- [ ] AI-powered item matching and suggestions
- [ ] Multi-language support for international students
- [ ] Integration with student information systems
- [ ] Analytics dashboard for university administrators
- [ ] Mobile app widgets for quick access
- [ ] Campus map integration with item locations

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ **Commercial use** - Use for commercial purposes
- ✅ **Modification** - Modify and distribute modifications
- ✅ **Distribution** - Distribute original or modified versions
- ✅ **Private use** - Use privately
- ❌ **Liability** - No warranty or liability
- ❌ **Warranty** - No warranty provided

## 💬 Support & Community

### Getting Help

- 📖 **Documentation** - Check this README and inline code comments
- 🐛 **Bug Reports** - [Open an issue](https://github.com/BreyeFoka/lost-and-found-app/issues) on GitHub
- 💡 **Feature Requests** - [Create a feature request](https://github.com/BreyeFoka/lost-and-found-app/issues/new)
- 📧 **Email Support** - Contact: support@lostandfound.app

### Community Guidelines

- Be respectful and inclusive
- Help others learn and contribute
- Follow the code of conduct
- Share knowledge and best practices
- Report security issues responsibly

---

## 🙏 Acknowledgments

Special thanks to:
- **React Native Community** - For the amazing mobile development framework
- **Prisma Team** - For the excellent database toolkit
- **Expo Team** - For simplifying React Native development
- **Socket.io Contributors** - For real-time communication capabilities
- **Open Source Community** - For all the libraries and tools that make this possible

---

<div align="center">

**Built with ❤️ by students, for students**

[📱 Download App](https://github.com/BreyeFoka/lost-and-found-app) • [🌟 Star on GitHub](https://github.com/BreyeFoka/lost-and-found-app) • [🐛 Report Bug](https://github.com/BreyeFoka/lost-and-found-app/issues)

</div>
