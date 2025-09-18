import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm/LoginForm';
import { classNames } from '../utils/helpers';

const Login: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={classNames(
      'min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8',
      'bg-gradient-to-br from-blue-50 to-indigo-100'
    )}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TaskFlow AI</h1>
          <p className="text-lg text-gray-600">Intelligent Task Management</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} TaskFlow AI. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;