export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateContact = (contact) => {
  // Allow international phone format, digits, space, plus, dash
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return contact.trim().length >= 7;
};

export const validateSignupForm = ({ name, email, contact, password, confirmPassword }) => {
  const errors = {};
  if (!name || name.trim().length < 2) {
    errors.name = "Please enter your full name (at least 2 characters).";
  }
  if (!email || !validateEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!contact || contact.trim().length < 6) {
    errors.contact = "Please enter a valid contact phone number.";
  }
  if (!password || !validatePassword(password)) {
    errors.password = "Password must be at least 6 characters long.";
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
