// src/utils/validation.js

/**
 * Validates a full name
 * Rules:
 * - Required
 * - Minimum 3 characters
 * - Cannot contain numbers
 * - Only letters and spaces allowed
 */
export const validateFullName = (name) => {
  if (!name || !name.trim()) {
    return "Full name is required";
  }
  
  if (name.trim().length < 3) {
    return "Name must be at least 3 characters";
  }
  
  // Check if name contains any numbers
  if (/\d/.test(name)) {
    return "Name cannot contain numbers";
  }
  
  // Check if name contains only letters and spaces
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return "Name can only contain letters and spaces";
  }
  
  return "";
};

/**
 * Validates an email address
 * Rules:
 * - Required
 * - Cannot start with a number
 * - Must be valid email format
 * - Must have proper domain
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return "Email is required";
  }
  
  // Check if email starts with a number
  if (/^\d/.test(email)) {
    return "Email cannot start with a number";
  }
  
  // Basic email format validation
  const emailRegex = /^[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  
  // Additional checks
  if (email.includes('..')) {
    return "Email cannot contain consecutive dots";
  }
  
  if (email.split('@')[1]?.startsWith('.')) {
    return "Invalid email format";
  }
  
  return "";
};

/**
 * Validates a password
 * Rules for signup:
 * - Required
 * - Minimum 8 characters (matching backend)
 * - Must contain lowercase letter
 * - Must contain uppercase letter
 * - Must contain a number
 * - Optionally: special character
 * 
 * Rules for login:
 * - Required
 * - Minimum 8 characters
 */
export const validatePassword = (password, isSignup = false) => {
  if (!password) {
    return "Password is required";
  }
  
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  
  // Additional checks for signup only
  if (isSignup) {
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain a lowercase letter";
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain an uppercase letter";
    }
    
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain a number";
    }
    
    // Optional: Check for special characters
    // if (!/(?=.*[@$!%*?&])/.test(password)) {
    //   return "Password must contain a special character (@$!%*?&)";
    // }
    
    // Check for spaces
    if (/\s/.test(password)) {
      return "Password cannot contain spaces";
    }
  }
  
  return "";
};

/**
 * Validates confirm password field
 * Rules:
 * - Required
 * - Must match original password
 */
export const validateConfirmPassword = (confirmPassword, password) => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  
  if (confirmPassword !== password) {
    return "Passwords do not match";
  }
  
  return "";
};

/**
 * Validates a username
 * Rules:
 * - Required
 * - Minimum 3 characters
 * - Maximum 20 characters
 * - Can contain letters, numbers, underscore, and hyphen
 * - Cannot start with a number
 * - Cannot have spaces
 */
export const validateUsername = (username) => {
  if (!username || !username.trim()) {
    return "Username is required";
  }
  
  if (username.length < 3) {
    return "Username must be at least 3 characters";
  }
  
  if (username.length > 20) {
    return "Username cannot exceed 20 characters";
  }
  
  // Cannot start with number
  if (/^\d/.test(username)) {
    return "Username cannot start with a number";
  }
  
  // Only letters, numbers, underscore, hyphen allowed
  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(username)) {
    return "Username can only contain letters, numbers, underscore, and hyphen";
  }
  
  // No spaces
  if (/\s/.test(username)) {
    return "Username cannot contain spaces";
  }
  
  return "";
};

/**
 * Password strength checker
 * Returns: { strength: 'weak' | 'medium' | 'strong', score: 0-100 }
 */
export const checkPasswordStrength = (password) => {
  let score = 0;
  
  if (!password) return { strength: 'weak', score: 0 };
  
  // Length check
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  
  // Character variety
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/\d/.test(password)) score += 15;
  if (/[@$!%*?&#]/.test(password)) score += 15;
  
  // Determine strength
  let strength = 'weak';
  if (score >= 80) strength = 'strong';
  else if (score >= 50) strength = 'medium';
  
  return { strength, score };
};

/**
 * Validates all login fields at once
 * Returns: { valid: boolean, errors: object }
 */
export const validateLoginForm = (email, password) => {
  const errors = {};
  
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(password, false);
  if (passwordError) errors.password = passwordError;
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates all signup fields at once
 * Returns: { valid: boolean, errors: object }
 */
export const validateSignupForm = (username, email, password, confirmPassword) => {
  const errors = {};
  
  const usernameError = validateFullName(username);
  if (usernameError) errors.username = usernameError;
  
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(password, true);
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(confirmPassword, password);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitizes input by removing potentially dangerous characters
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
};

/**
 * Format validation error for display
 */
export const formatValidationError = (error) => {
  if (!error) return null;
  
  // If it's already a formatted error message, return it
  if (typeof error === 'string') return error;
  
  // If it's an array of errors, join them
  if (Array.isArray(error)) return error.join(', ');
  
  // If it's an object with message property
  if (error.message) return error.message;
  
  // Default
  return 'Validation error occurred';
};

export default {
  validateFullName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateUsername,
  checkPasswordStrength,
  validateLoginForm,
  validateSignupForm,
  sanitizeInput,
  formatValidationError
};