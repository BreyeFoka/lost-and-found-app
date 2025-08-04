import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';

// Rate limiting for authentication endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiting
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting for password reset
export const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Maximum 3 password reset attempts per hour
  message: {
    success: false,
    message: 'Too many password reset attempts. Please try again in 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helmet security configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Account lockout tracking
interface LoginAttempt {
  count: number;
  lockUntil?: Date;
  lastAttempt: Date;
}

const loginAttempts = new Map<string, LoginAttempt>();

// Clean up old entries every hour
setInterval(() => {
  const now = new Date();
  for (const [email, attempt] of loginAttempts.entries()) {
    // Remove entries older than 24 hours
    if (now.getTime() - attempt.lastAttempt.getTime() > 24 * 60 * 60 * 1000) {
      loginAttempts.delete(email);
    }
  }
}, 60 * 60 * 1000);

export const accountLockout = {
  // Check if account is locked
  isLocked: (email: string): boolean => {
    const attempt = loginAttempts.get(email.toLowerCase());
    if (!attempt) return false;
    
    if (attempt.lockUntil && new Date() < attempt.lockUntil) {
      return true;
    }
    
    // Clear lock if time has passed
    if (attempt.lockUntil && new Date() >= attempt.lockUntil) {
      loginAttempts.delete(email.toLowerCase());
      return false;
    }
    
    return false;
  },

  // Record failed login attempt
  recordFailedAttempt: (email: string): void => {
    const emailLower = email.toLowerCase();
    const now = new Date();
    const attempt = loginAttempts.get(emailLower) || { count: 0, lastAttempt: now };
    
    attempt.count += 1;
    attempt.lastAttempt = now;
    
    // Lock account after 5 failed attempts for 30 minutes
    if (attempt.count >= 5) {
      attempt.lockUntil = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes
    }
    
    loginAttempts.set(emailLower, attempt);
  },

  // Clear failed attempts on successful login
  clearAttempts: (email: string): void => {
    loginAttempts.delete(email.toLowerCase());
  },

  // Get remaining lockout time
  getLockoutTime: (email: string): number => {
    const attempt = loginAttempts.get(email.toLowerCase());
    if (!attempt || !attempt.lockUntil) return 0;
    
    const remaining = attempt.lockUntil.getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(remaining / 1000 / 60)); // Return minutes
  }
};

// Middleware to check account lockout
export const checkAccountLockout = (req: Request, res: Response, next: NextFunction): void => {
  const { email } = req.body;
  
  if (!email) {
    next();
    return;
  }
  
  if (accountLockout.isLocked(email)) {
    const lockoutMinutes = accountLockout.getLockoutTime(email);
    res.status(423).json({
      success: false,
      message: `Account is temporarily locked due to multiple failed login attempts. Try again in ${lockoutMinutes} minutes.`,
      lockoutMinutes
    });
    return;
  }
  
  next();
};

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  // Sanitize common XSS patterns
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .trim();
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    
    return obj;
  };
  
  if (req.body) {
    req.body = sanitize(req.body);
  }
  
  // For query parameters, we need to sanitize each property individually
  if (req.query) {
    for (const key in req.query) {
      if (req.query.hasOwnProperty(key)) {
        const value = req.query[key];
        if (typeof value === 'string') {
          (req.query as any)[key] = sanitize(value);
        } else if (Array.isArray(value)) {
          (req.query as any)[key] = value.map(sanitize);
        }
      }
    }
  }
  
  next();
};

// Security logging middleware
export const securityLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Log suspicious activities
  const suspiciousPatterns = [
    /union.*select/i,
    /select.*from/i,
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i
  ];
  
  const requestData = JSON.stringify({
    body: req.body,
    query: req.query,
    headers: req.headers
  });
  
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(requestData));
  
  if (isSuspicious) {
    console.warn('Suspicious request detected:', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};
