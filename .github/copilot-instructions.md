<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Lost and Found App - Development Guidelines

## Project Structure
This is a full-stack mobile application with React Native Expo frontend and Node.js/Express backend.

### Technologies Used
- **Frontend**: React Native with Expo, TypeScript, React Navigation
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Real-time**: Socket.io for chat functionality
- **Authentication**: JWT tokens
- **File Upload**: Multer for image handling

### Architecture Patterns
- Follow REST API conventions for backend endpoints
- Use proper error handling and validation
- Implement authentication middleware for protected routes
- Use TypeScript for type safety across the entire stack
- Follow React Native best practices for mobile UI/UX

### Security Considerations
- Always validate user input on both client and server
- Use proper authentication checks for protected resources
- Implement rate limiting to prevent abuse
- Sanitize file uploads and validate file types
- Use HTTPS in production
- Hash passwords with bcrypt

### Code Style
- Use descriptive variable and function names
- Follow consistent naming conventions (camelCase for JS/TS)
- Add comments for complex business logic
- Use proper TypeScript types instead of 'any'
- Keep components small and focused on single responsibility

### Version Control Guidelines
- **Commit Frequency Rule**: After modifying 5 files, pause development to commit changes
- Always ensure code is in a usable/buildable state before committing
- Write descriptive commit messages explaining what was changed and why
- Create logical checkpoints during ongoing modifications
- Continue development after each commit to maintain momentum
- Use conventional commit format: `type(scope): description`

### Database Guidelines
- Use Prisma for all database operations
- Always use transactions for multi-table operations
- Include proper foreign key constraints
- Use indexes for frequently queried fields
- Handle database errors gracefully

### Mobile App Guidelines
- Design for both iOS and Android compatibility
- Use responsive design principles
- Implement proper loading states and error handling
- Follow accessibility guidelines
- Use proper navigation patterns with React Navigation
- Optimize images and handle different screen sizes
