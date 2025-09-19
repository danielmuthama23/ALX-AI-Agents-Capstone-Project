import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../common/Button/Button';
import { classNames } from '../../../utils/helpers';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onError,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      await register(formData.username, formData.email, formData.password);
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ general: errorMessage });
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = {
    hasLength: formData.password.length >= 6,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password)
  };

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  return (
    <div className={classNames('max-w-md w-full mx-auto', className)}>
      <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={classNames(
                  'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
                  errors.username ? 'border-red-300' : 'border-gray-300'
                )}
                placeholder="Enter your username"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={classNames(
                  'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
                  errors.email ? 'border-red-300' : 'border-gray-300'
                )}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={classNames(
                  'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10',
                  errors.password ? 'border-red-300' : 'border-gray-300'
                )}
                placeholder="Create a password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            
            {formData.password && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-2">Password strength:</p>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <CheckCircleIcon className={classNames(
                      'h-4 w-4 mr-2',
                      passwordStrength.hasLength ? 'text-green-500' : 'text-gray-400'
                    )} />
                    <span className={passwordStrength.hasLength ? 'text-green-600' : 'text-gray-600'}>
                      At least 6 characters
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircleIcon className={classNames(
                      'h-4 w-4 mr-2',
                      passwordStrength.hasUppercase ? 'text-green-500' : 'text-gray-400'
                    )} />
                    <span className={passwordStrength.hasUppercase ? 'text-green-600' : 'text-gray-600'}>
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircleIcon className={classNames(
                      'h-4 w-4 mr-2',
                      passwordStrength.hasLowercase ? 'text-green-500' : 'text-gray-400'
                    )} />
                    <span className={passwordStrength.hasLowercase ? 'text-green-600' : 'text-gray-600'}>
                      One lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircleIcon className={classNames(
                      'h-4 w-4 mr-2',
                      passwordStrength.hasNumber ? 'text-green-500' : 'text-gray-400'
                    )} />
                    <span className={passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-600'}>
                      One number
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="mt-1 relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={classNames(
                  'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10',
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                )}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={!isPasswordStrong}
              fullWidth
              className="justify-center"
            >
              Create Account
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;