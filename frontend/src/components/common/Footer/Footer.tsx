import React from 'react';
import { 
  HeartIcon, 
  CodeBracketIcon,
  AcademicCapIcon 
} from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          {/* Left section - Brand and description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">TaskFlow AI</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Intelligent task management powered by AI. Stay organized and productive.
            </p>
          </div>

          {/* Middle section - Links */}
          <div className="mt-8 md:mt-0 md:mx-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Product
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="/features" className="text-sm text-gray-600 hover:text-gray-900">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="/integrations" className="text-sm text-gray-600 hover:text-gray-900">
                      Integrations
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="/help" className="text-sm text-gray-600 hover:text-gray-900">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="/docs" className="text-sm text-gray-600 hover:text-gray-900">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="/blog" className="text-sm text-gray-600 hover:text-gray-900">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="/careers" className="text-sm text-gray-600 hover:text-gray-900">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right section - Social and copyright */}
          <div className="mt-8 md:mt-0">
            <div className="flex space-x-6">
              <a
                href="https://github.com/your-username/taskflow-ai"
                className="text-gray-400 hover:text-gray-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">GitHub</span>
                <CodeBracketIcon className="h-6 w-6" />
              </a>
              
              <a
                href="https://twitter.com/your-username"
                className="text-gray-400 hover:text-gray-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section - Copyright and legal */}
        <div className="mt-8 border-t border-gray-100 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <span>&copy; {currentYear} TaskFlow AI. All rights reserved.</span>
            <span className="mx-1">•</span>
            <span>Made with</span>
            <HeartIcon className="h-4 w-4 text-red-500 mx-1" />
            <span>by the TaskFlow team</span>
          </div>

          <div className="mt-4 md:mt-0">
            <nav className="flex space-x-6 text-sm text-gray-600">
              <a href="/privacy" className="hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-gray-900">
                Terms of Service
              </a>
              <a href="/cookies" className="hover:text-gray-900">
                Cookie Policy
              </a>
            </nav>
          </div>
        </div>

        {/* Attribution */}
        <div className="mt-4 text-xs text-gray-500">
          <p>
            TaskFlow AI uses AI technology to help you manage tasks more effectively. 
            Part of the ALX AI for Developers program.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;