// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation (basic)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone.trim());
};

// Student ID validation (basic format)
export const isValidStudentId = (studentId: string): boolean => {
  // Assuming student ID is alphanumeric, 6-12 characters
  const studentIdRegex = /^[A-Za-z0-9]{6,12}$/;
  return studentIdRegex.test(studentId.trim());
};

// Name validation
export const isValidName = (name: string): boolean => {
  // At least 2 characters, letters, spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
  return nameRegex.test(name.trim());
};

// Item title validation
export const isValidItemTitle = (title: string): boolean => {
  const trimmed = title.trim();
  return trimmed.length >= 3 && trimmed.length <= 100;
};

// Item description validation
export const isValidItemDescription = (description: string): boolean => {
  const trimmed = description.trim();
  return trimmed.length >= 10 && trimmed.length <= 1000;
};

// Location validation
export const isValidLocation = (location: string): boolean => {
  const trimmed = location.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
};

// Category validation
export const isValidCategory = (category: string): boolean => {
  const validCategories = [
    'Electronics',
    'Clothing',
    'Accessories',
    'Books',
    'Documents',
    'Keys',
    'Sports Equipment',
    'Bags',
    'Jewelry',
    'Other'
  ];
  return validCategories.includes(category);
};

// Password strength checker
export const getPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters long');
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    feedback.push('Password should contain at least one lowercase letter');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('Password should contain at least one uppercase letter');
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    feedback.push('Password should contain at least one number');
  } else {
    score += 1;
  }

  if (!/[@$!%*?&]/.test(password)) {
    feedback.push('Password should contain at least one special character');
  } else {
    score += 1;
  }

  return { score, feedback };
};

// Form validation helpers
export const validateLoginForm = (email: string, password: string): string[] => {
  const errors: string[] = [];

  if (!email.trim()) {
    errors.push('Email is required');
  } else if (!isValidEmail(email)) {
    errors.push('Please enter a valid email address');
  }

  if (!password) {
    errors.push('Password is required');
  }

  return errors;
};

export const validateRegisterForm = (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  studentId: string;
  phoneNumber?: string;
}): string[] => {
  const errors: string[] = [];

  if (!data.firstName.trim()) {
    errors.push('First name is required');
  } else if (!isValidName(data.firstName)) {
    errors.push('Please enter a valid first name');
  }

  if (!data.lastName.trim()) {
    errors.push('Last name is required');
  } else if (!isValidName(data.lastName)) {
    errors.push('Please enter a valid last name');
  }

  if (!data.email.trim()) {
    errors.push('Email is required');
  } else if (!isValidEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }

  if (!data.password) {
    errors.push('Password is required');
  } else if (!isValidPassword(data.password)) {
    errors.push('Password must be at least 8 characters with uppercase, lowercase, and number');
  }

  if (!data.confirmPassword) {
    errors.push('Please confirm your password');
  } else if (data.password !== data.confirmPassword) {
    errors.push('Passwords do not match');
  }

  if (!data.studentId.trim()) {
    errors.push('Student ID is required');
  } else if (!isValidStudentId(data.studentId)) {
    errors.push('Please enter a valid student ID');
  }

  if (data.phoneNumber && !isValidPhoneNumber(data.phoneNumber)) {
    errors.push('Please enter a valid phone number');
  }

  return errors;
};

export const validateItemForm = (data: {
  title: string;
  description: string;
  category: string;
  location: string;
  dateLost?: Date;
  dateFound?: Date;
}): string[] => {
  const errors: string[] = [];

  if (!data.title.trim()) {
    errors.push('Item title is required');
  } else if (!isValidItemTitle(data.title)) {
    errors.push('Title must be between 3 and 100 characters');
  }

  if (!data.description.trim()) {
    errors.push('Description is required');
  } else if (!isValidItemDescription(data.description)) {
    errors.push('Description must be between 10 and 1000 characters');
  }

  if (!data.category) {
    errors.push('Please select a category');
  } else if (!isValidCategory(data.category)) {
    errors.push('Please select a valid category');
  }

  if (!data.location.trim()) {
    errors.push('Location is required');
  } else if (!isValidLocation(data.location)) {
    errors.push('Location must be between 2 and 100 characters');
  }

  return errors;
};
