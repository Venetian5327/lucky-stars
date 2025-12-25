import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showStars?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = '', showStars = true }) => {
  return (
    <div className={`min-h-screen w-full relative bg-gradient-to-b from-[#0B0B2A] via-[#1B1B4B] to-[#2E2E5E] overflow-hidden text-white ${className}`}>
      
      {/* Dynamic Background Stars */}
      {showStars && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-70 animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>
      )}
      
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};