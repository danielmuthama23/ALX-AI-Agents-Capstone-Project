import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../common/Button/Button';
import { classNames } from '../../../utils/helpers';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onError,
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      await login(email, password);
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setErrors({ general: errorMessage });
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classNames('max-w-md w-full mx-auto', className)}>
      <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={classNames(
                  'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10',
                  errors.password ? 'border-red-300' : 'border-gray-300'
                )}
                placeholder="Enter your password"
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
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              fullWidth
              className="justify-center"
            >
              Sign in
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
            </div>
          </div>

          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              For testing purposes, you can use:
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>Email:</strong> demo@taskflow.ai</p>
              <p><strong>Password:</strong> demo123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;