// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register, login } from "@/store/slices/userSlice.js";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const Login = () => {
  const [mode, setMode] = useState("login"); // "login" | "signup"

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");

  // Validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { loading, isAuthenticated, error } = useSelector((state) => state.user || {});
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  // Show backend errors if any
  useEffect(() => {
    if (error) {
      // Backend error is already shown via toast in userSlice
      // But we can also clear form errors
      setErrors({});
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) navigateTo("/");
  }, [isAuthenticated, navigateTo]);

  // Validation Functions
  const validateFullName = (name) => {
    if (!name || !name.trim()) return "Full name is required";
    if (name.trim().length < 3) return "Name must be at least 3 characters";
    
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

  const validateEmail = (email) => {
    if (!email || !email.trim()) return "Email is required";
    
    // Check if email starts with a number
    if (/^\d/.test(email)) {
      return "Email cannot start with a number";
    }
    
    // Basic email format validation
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    
    return "";
  };

  const validatePassword = (password, isSignup = false) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    
    // Additional checks for signup
    if (isSignup) {
      if (!/(?=.*[a-z])/.test(password)) return "Password must contain a lowercase letter";
      if (!/(?=.*[A-Z])/.test(password)) return "Password must contain an uppercase letter";
      if (!/(?=.*\d)/.test(password)) return "Password must contain a number";
    }
    
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  // Handle field changes with real-time validation
  const handleFieldChange = (field, value) => {
    // Update the field value
    switch(field) {
      case 'username':
        setUserName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }

    // Validate if field has been touched
    if (touched[field]) {
      validateField(field, value);
    }
  };

  // Handle blur events
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let value;
    switch(field) {
      case 'username':
        value = username;
        break;
      case 'email':
        value = email;
        break;
      case 'password':
        value = password;
        break;
      case 'confirmPassword':
        value = confirmPassword;
        break;
      default:
        value = '';
    }
    
    validateField(field, value);
  };

  // Validate individual field
  const validateField = (field, value) => {
    let error = "";
    
    switch(field) {
      case 'username':
        error = validateFullName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value, mode === 'signup');
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(value, password);
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return error;
  };

  // Switch mode and clear errors
  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setErrors({});
    setTouched({});
    setUserName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    // Validate all fields
    const usernameError = validateFullName(username);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password, true);
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password);

    setErrors({
      username: usernameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError
    });

    // If there are any errors, don't submit
    if (usernameError || emailError || passwordError || confirmPasswordError) {
      return;
    }

    const data = {
      username,
      email,
      password
    };

    dispatch(register(data));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Mark fields as touched
    setTouched({
      email: true,
      password: true
    });

    // Validate fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password, false);

    setErrors({
      email: emailError,
      password: passwordError
    });

    // If there are any errors, don't submit
    if (emailError || passwordError) {
      return;
    }

    const data = {
      email,
      password
    };

    dispatch(login(data));
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 pt-[5vh] bg-cover bg-center bg-[url('public/images/Ayush1.jpg')]"
    >
      <div className="w-full max-w-lg mx-auto">
        {/* Card */}
        <div className="bg-[#E1EEBC] rounded-[40px] shadow-xl p-8 sm:p-10 mx-4">
          <h1 className="text-3xl font-itim text-center text-[#123]">Welcome</h1>
          <p className="text-center text-gray-700 mt-1 text-sm">
            Log in to Virtual Herbal Garden
          </p>

          {/* Toggle */}
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={() => handleModeSwitch("login")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                mode === "login"
                  ? "bg-[#0c8a66] text-white shadow"
                  : "bg-transparent text-[#0c8a66] border border-transparent hover:underline"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => handleModeSwitch("signup")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                mode === "signup"
                  ? "bg-[#0c8a66] text-white shadow"
                  : "bg-transparent text-[#0c8a66] border border-transparent hover:underline"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form area */}
          <div className="mt-6">
            {mode === "login" ? (
              <div className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-sm text-[#0c6b58] font-medium text-left mb-1">
                    Email address*
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 transition-all ${
                      errors.email && touched.email
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-[#0c8a66]"
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && touched.email && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm text-[#0c6b58] font-medium text-left mb-1">
                    Password*
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => handleFieldChange('password', e.target.value)}
                      onBlur={() => handleBlur('password')}
                      className={`w-full px-4 py-2 pr-10 rounded-md border focus:outline-none focus:ring-2 transition-all ${
                        errors.password && touched.password
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-[#0c8a66]"
                      }`}
                      placeholder="Your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <a href="#0" className="text-sm text-blue-700 hover:underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full mt-2 bg-[#0c8a66] text-white py-3 rounded-md text-lg shadow hover:bg-[#0a7558] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Logging in..." : "Continue"}
                </button>

                <p className="text-center text-sm text-gray-700 mt-3">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("signup")}
                    className="text-blue-700 font-medium hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Full Name Field */}
                <div>
                  <label className="block text-sm text-[#0c6b58] font-medium text-left mb-1">
                    Full name*
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => handleFieldChange('username', e.target.value)}
                    onBlur={() => handleBlur('username')}
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 transition-all ${
                      errors.username && touched.username
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-[#0c8a66]"
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.username && touched.username && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>{errors.username}</span>
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm text-[#0c6b58] font-medium text-left mb-1">
                    Email address*
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 transition-all ${
                      errors.email && touched.email
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-[#0c8a66]"
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && touched.email && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm text-[#0c6b58] font-medium text-left mb-1">
                    Password*
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => handleFieldChange('password', e.target.value)}
                      onBlur={() => handleBlur('password')}
                      className={`w-full px-4 py-2 pr-10 rounded-md border focus:outline-none focus:ring-2 transition-all ${
                        errors.password && touched.password
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-[#0c8a66]"
                      }`}
                      placeholder="Your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm text-[#0c6b58] font-medium text-left mb-1">
                    Confirm Password*
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                      onBlur={() => handleBlur('confirmPassword')}
                      className={`w-full px-4 py-2 pr-10 rounded-md border focus:outline-none focus:ring-2 transition-all ${
                        errors.confirmPassword && touched.confirmPassword
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-[#0c8a66]"
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>{errors.confirmPassword}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full mt-2 bg-[#0c8a66] text-white py-3 rounded-md text-lg shadow hover:bg-[#0a7558] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <hr className="flex-1 border-gray-300" />
            <span className="text-sm text-gray-500">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;