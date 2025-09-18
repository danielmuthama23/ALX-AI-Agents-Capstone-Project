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

            <div className="