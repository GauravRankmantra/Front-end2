export const validate = (data, type) => {
  const errors = {};

  // Email Validation
  if (!data.email) {
    errors.email = "Email is Required!";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email).toLowerCase())
  ) {
    errors.email = "Email address is invalid!";
  } else {
    delete errors.email; // No error
  }

  // Password Validation
  if (!data.password) {
    errors.password = "Password is Required";
  } else if (!(data.password.length >= 6)) {
    errors.password = "Password needs to be 6 characters or more";
  } else {
    delete errors.password; // No error
  }

  if (type === "signUp") {
    // Full Name Validation (for signUp)
    if (!data.fullName.trim()) {
      errors.fullName = "Username is Required!";
    } else {
      delete errors.fullName; // No error
    }

   
  }

  return errors;
};
