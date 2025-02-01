import React from 'react';

export const LoadingSpinner = ({ size = 'default', fullScreen = false }) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const spinner = (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div className="h-full w-full rounded-full border-4 border-gray-200 border-t-[#FF5C5C]"></div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4">
    <LoadingSpinner size="large" />
    <p className="mt-4 text-gray-600 text-sm animate-pulse">Loading...</p>
  </div>
);

export const LoadingSkeleton = ({ lines = 3, className = "" }) => (
  <div className={`space-y-3 ${className}`}>
    {[...Array(lines)].map((_, i) => (
      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
    ))}
  </div>
);

export default LoadingSpinner; 