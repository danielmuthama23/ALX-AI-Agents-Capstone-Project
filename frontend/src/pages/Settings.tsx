import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/common/Button/Button';
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

const Settings: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themeOptions = [
    {
      value: 'light' as const,
      label: 'Light',
      icon: SunIcon,
      description: 'Bright and clean appearance'
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      icon: MoonIcon,
      description: 'Easy on the eyes in low light'
    },
    {
      value: 'system' as const,
      label: 'System',
      icon: ComputerDesktopIcon,
      description: 'Follow your device settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Customize your TaskFlow experience
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Appearance Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Appearance</h2>
            <p className="text-gray-600 mb-6">
              Customize how TaskFlow looks and feels on your device.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = theme === option.value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`
                      relative p-4 rounded-lg border-2 text-left transition-all
                      ${isActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center mb-3">
                      <Icon className="h-5 w-5 text-gray-600 mr-2" />
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                    
                    {isActive && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Current theme: {resolvedTheme} {theme === 'system' && '(System)'}
            </p>
          </section>

          {/* Account Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Change Password</h3>
                  <p className="text-sm text-gray-600">Update your account password</p>
                </div>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Export Data</h3>
                  <p className="text-sm text-gray-600">Download your tasks and data</p>
                </div>
                <Button variant="outline" size="sm">
                  Export Data
                </Button>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-600">Manage email and push notifications</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Language</h3>
                  <p className="text-sm text-gray-600">English (US)</p>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            TaskFlow AI v1.0.0 • © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;