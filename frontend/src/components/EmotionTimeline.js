import React, { useState, useEffect } from 'react';

const EmotionTimeline = ({ colors }) => {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock timeline data for demo - December 2024
    const mockData = [
      { date: 'Dec 21', vibeScore: 65, emotion: 'calm' },
      { date: 'Dec 22', vibeScore: 78, emotion: 'joy' },
      { date: 'Dec 23', vibeScore: 45, emotion: 'anxiety' },
      { date: 'Dec 24', vibeScore: 82, emotion: 'hope' },
      { date: 'Dec 25', vibeScore: 90, emotion: 'joy' },
      { date: 'Dec 26', vibeScore: 88, emotion: 'joy' },
      { date: 'Dec 27', vibeScore: 75, emotion: 'calm' },
      { date: 'Dec 28', vibeScore: 85, emotion: 'contemplative' }
    ];
    
    setTimeout(() => {
      setTimelineData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 animate-pulse">
        <div className="h-4 bg-gray-600 rounded mb-4"></div>
        <div className="h-32 bg-gray-600 rounded"></div>
      </div>
    );
  }

  return (
    <div 
      className="backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 mb-8"
      style={{
        background: `linear-gradient(135deg, rgba(15,15,35,0.9), rgba(26,26,46,0.7))`,
        boxShadow: `0 25px 50px -12px ${colors[0]}20, inset 0 1px 0 rgba(255,255,255,0.1)`
      }}
    >
      <div className="text-center mb-4">
        <div className="text-2xl mb-2">📈</div>
        <h3 className="text-xl font-bold text-white">Emotional Journey</h3>
        <p className="text-gray-300 text-sm">Your vibe scores over time</p>
      </div>
      
      <div className="h-40 flex items-end justify-between px-4">
        {timelineData.map((item, index) => (
          <div key={index} className="flex flex-col items-center group">
            <div 
              className="w-8 rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer"
              style={{
                height: `${(item.vibeScore / 100) * 120}px`,
                background: `linear-gradient(to top, ${colors[0]}, ${colors[1]})`
              }}
              title={`${item.date}: ${item.vibeScore} (${item.emotion})`}
            />
            <div className="text-xs text-gray-400 mt-2 transform rotate-45 origin-left">
              {item.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionTimeline;