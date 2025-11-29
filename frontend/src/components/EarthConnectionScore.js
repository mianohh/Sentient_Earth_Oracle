import React from 'react';

const EarthConnectionScore = ({ score, colors }) => {
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div 
      className="backdrop-blur-xl rounded-3xl p-6 text-center border border-gray-700/50"
      style={{
        background: `linear-gradient(135deg, rgba(15,15,35,0.9), rgba(26,26,46,0.7))`,
        boxShadow: `0 25px 50px -12px ${colors[2]}20, inset 0 1px 0 rgba(255,255,255,0.1)`
      }}
    >
      <div className="mb-4">
        <div className="text-3xl mb-2">🌍</div>
        <h3 className="text-lg font-bold text-white">Earth Connection</h3>
      </div>
      
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="rgba(75, 85, 99, 0.3)"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={colors[2]}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${colors[2]}40)`
            }}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div 
              className="text-2xl font-bold"
              style={{ color: colors[2] }}
            >
              {score}
            </div>
            <div className="text-xs text-gray-400">/ 100</div>
          </div>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm">
        Harmony between your emotions and Earth's energy
      </p>
    </div>
  );
};

export default EarthConnectionScore;