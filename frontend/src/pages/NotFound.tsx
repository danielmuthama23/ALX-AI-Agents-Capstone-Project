import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button/Button';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        {/* Illustration */}
        <div className="mb-8">
          <div className="mx-auto h-48 w-48 text-gray-300">
            <svg
              className="w-full h-full"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 180C144.183 180 180 144.183 180 100C180 55.8172 144.183 20 100 20C55.8172 20 20 55.8172 20 100C20 144.183 55.8172 180 100 180Z"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                d="M100 140C122.091 140 140 122.091 140 100C140 77.9086 122.091 60 100 60C77.9086 60 60 77.9086 60 100C60 122.091 77.9086 140 100 140Z"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                d="M70 70L130 130"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                d="M130 70L70 130"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. The page might have been moved, 
          deleted, or you entered the wrong URL.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button
              variant="primary"
              icon={<HomeIcon className="h-4 w-4" />}
              size="lg"
            >
              Go Home
            </Button>
          </Link>
          
          <Button
            variant="outline"
            icon={<ArrowLeftIcon className="h-4 w-4" />}
            size="lg"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12">
          <p className="text-sm text-gray-500 mb-4">Need help?</p>
          <div className="flex justify-center space-x-6">
            <a href="/support" className="text-blue-600 hover:text-blue-500 text-sm">
              Contact Support
            </a>
            <a href="/docs" className="text-blue-600 hover:text-blue-500 text-sm">
              Documentation
            </a>
            <a href="/status" className="text-blue-600 hover:text-blue-500 text-sm">
              System Status
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;