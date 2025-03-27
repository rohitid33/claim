import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="animate-pulse">
        <svg 
          className="w-16 h-16 text-blue-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M5 13l4 4L19 7"
            className="animate-[dash_1.5s_ease-in-out_infinite]"
          />
        </svg>
      </div>
    </div>
  );
} 