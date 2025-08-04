# Lost and Found - Student Community App

A mobile application built with React Native Expo and Node.js that helps students find their lost items by connecting them with people who have found items.

## Features

### Core Functionality
- **Report Lost Items**: Students can report items they've lost with photos, descriptions, and location details
- **Report Found Items**: Users can post items they've found to help return them to owners
- **Real-time Chat**: Built-in messaging system to coordinate item returns
- **Image Upload**: Photo support for better item identification
- **Location-based Search**: Find items reported in specific areas
- **User Authentication**: Secure registration and login system

### Key Features (Planned)
- Push notifications for item matches
- Advanced search and filtering
- University integration
- Reputation system
- Administrative moderation tools

## Tech Stack

### Frontend (Mobile App)
- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Socket.io Client** for real-time chat
- **Axios** for API requests
- **Expo Camera** and **Image Picker** for photo capture

### Backend (API)
- **Node.js** with Express
- **TypeScript**
- **Prisma ORM** with PostgreSQL
- **Socket.io** for real-time functionality
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing

### Database
- **PostgreSQL** with Prisma ORM
- Comprehensive schema for users, items, chats, and messages

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

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Expo CLI (`npm install -g @expo/cli`)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your database URL and other configuration:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/lost_and_found_db"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=5000
   ```

4. **Setup database**
   ```bash
   npm run db:migrate
   npm run db:generate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Mobile App Setup

1. **Navigate to mobile directory**
   ```bash
   cd mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the Expo development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - For iOS: `npm run ios` (requires macOS)
   - For Android: `npm run android`
   - For web: `npm run web`
   - Use Expo Go app to scan QR code for physical device testing

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Lost Items
- `GET /api/lost-items` - Get all lost items
- `POST /api/lost-items` - Create lost item report
- `GET /api/lost-items/:id` - Get specific lost item
- `PUT /api/lost-items/:id` - Update lost item
- `DELETE /api/lost-items/:id` - Delete lost item

### Found Items
- `GET /api/found-items` - Get all found items
- `POST /api/found-items` - Create found item report
- `GET /api/found-items/:id` - Get specific found item
- `PUT /api/found-items/:id` - Update found item
- `DELETE /api/found-items/:id` - Delete found item

### Chat
- `GET /api/chat/rooms` - Get user's chat rooms
- `POST /api/chat/rooms` - Create new chat room
- `GET /api/chat/rooms/:id/messages` - Get chat messages

## Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Student profiles with authentication
- **LostItems**: Items that have been lost
- **FoundItems**: Items that have been found
- **ChatRooms**: Communication channels between users
- **Messages**: Real-time chat messages
- **Reports**: Content moderation system

## Development

### Available Scripts

**Backend**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

**Mobile App**
- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/lost_and_found_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif
```

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- Rate limiting to prevent abuse
- File upload restrictions
- CORS configuration
- Helmet.js for security headers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Push notifications for item matches
- [ ] Advanced search filters
- [ ] Image recognition for better matching
- [ ] University-specific deployments
- [ ] Admin dashboard for moderation
- [ ] Reputation and rating system
- [ ] Integration with university systems
- [ ] Multi-language support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@lostandfound.app or open an issue in the repository.
