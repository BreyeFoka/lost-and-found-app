import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/database';
import { logger } from '../utils/logger';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const initializeSocket = (io: Server): void => {
  // Authentication middleware for socket connections
  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      if (!process.env.JWT_SECRET) {
        return next(new Error('JWT_SECRET is not defined'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`User connected: ${socket.userId}`);

    // Join user to their personal room
    socket.join(`user:${socket.userId}`);

    // Handle joining chat rooms
    socket.on('join-chat', async (chatRoomId: string) => {
      try {
        // Verify user is participant in the chat room
        const participant = await prisma.chatRoomParticipant.findFirst({
          where: {
            chatRoomId,
            userId: socket.userId
          }
        });

        if (participant) {
          socket.join(`chat:${chatRoomId}`);
          logger.info(`User ${socket.userId} joined chat room ${chatRoomId}`);
        } else {
          socket.emit('error', { message: 'Not authorized to join this chat room' });
        }
      } catch (error) {
        logger.error('Error joining chat room:', error);
        socket.emit('error', { message: 'Error joining chat room' });
      }
    });

    // Handle leaving chat rooms
    socket.on('leave-chat', (chatRoomId: string) => {
      socket.leave(`chat:${chatRoomId}`);
      logger.info(`User ${socket.userId} left chat room ${chatRoomId}`);
    });

    // Handle sending messages
    socket.on('send-message', async (data: {
      chatRoomId: string;
      content: string;
      type?: 'TEXT' | 'IMAGE';
    }) => {
      try {
        // Verify user is participant in the chat room
        const participant = await prisma.chatRoomParticipant.findFirst({
          where: {
            chatRoomId: data.chatRoomId,
            userId: socket.userId
          }
        });

        if (!participant) {
          socket.emit('error', { message: 'Not authorized to send messages in this chat room' });
          return;
        }

        // Create message in database
        const message = await prisma.message.create({
          data: {
            content: data.content,
            type: data.type || 'TEXT',
            userId: socket.userId!,
            chatRoomId: data.chatRoomId
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        });

        // Emit message to all participants in the chat room
        io.to(`chat:${data.chatRoomId}`).emit('new-message', message);

        logger.info(`Message sent in chat room ${data.chatRoomId} by user ${socket.userId}`);
      } catch (error) {
        logger.error('Error sending message:', error);
        socket.emit('error', { message: 'Error sending message' });
      }
    });

    // Handle typing indicators
    socket.on('typing', (data: { chatRoomId: string; isTyping: boolean }) => {
      socket.to(`chat:${data.chatRoomId}`).emit('user-typing', {
        userId: socket.userId,
        isTyping: data.isTyping
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userId}`);
    });
  });
};
