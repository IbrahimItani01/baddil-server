import { faker } from '@faker-js/faker';

export const generateValidPassword = (): string => {
  const minLength = 12;
  
  const specialChars = ['-', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '=', '+'];

  // Function to check if password meets the requirements
  const isValidPassword = (password: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    // Generate a regular expression that includes all special characters
    const hasSpecialChar = new RegExp(`[${specialChars.join('')}]`).test(password);
    
    const hasMinLength = password.length >= minLength;

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;
  };

  // Generate password and check if valid
  const generatePassword = (): string => {
    const password = faker.internet.password();

    if (isValidPassword(password)) {
      return password;
    } else {
      // Recall the function if the password doesn't meet the criteria
      return generatePassword();
    }
  };

  return generatePassword();
};


