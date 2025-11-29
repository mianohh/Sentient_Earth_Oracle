import React, { useState, useEffect } from 'react';

const SettingsModal = ({ isOpen, onClose, colors }) => {
  const [settings, setSettings] = useState({
    reduceAnimations: false,
    highContrast: false
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('oracleSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      applySettings(parsed);
    }
  }, []);

  const applySettings = (newSettings) => {
    const root = document.documentElement;
    
    if (newSettings.reduceAnimations) {
      root.style.setProperty('--animation-duration', '0.1s');
      root.style.setProperty('--transition-duration', '0.1s');
    } else {
      root.style.setProperty('--animation-duration', '1s');
      root.style.setProperty('--transition-duration', '0.5s');
    }
    
    if (newSettings.highContrast) {
      root.style.setProperty('--text-contrast', '1');
      root.style.setProperty('--bg-opacity', '0.95');
    } else {
      root.style.setProperty('--text-contrast', '0.9');
      root.style.setProperty('--bg-opacity', '0.8');
    }
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('oracleSettings', JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'rgba(0,0,0,0.7)' }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 max-w-md w-full"
        style={{
          background: `linear-gradient(135deg, rgba(15,15,35,0.95), rgba(26,26,46,0.9))`,
          boxShadow: `0 25px 50px -12px ${colors[0]}30`
        }}
      >
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">⚙️</div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
        </div>
        
        <div className="space-y-6">
          {/* Reduce Animations */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Reduce Animations</h3>
              <p className="text-gray-400 text-sm">Minimize motion for better focus</p>
            </div>
            <button
              onClick={() => handleSettingChange('reduceAnimations', !settings.reduceAnimations)}
              className={`w-12 h-6 rounded-full transition-all duration-300 ${
                settings.reduceAnimations ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div 
                className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                  settings.reduceAnimations ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          
          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">High Contrast</h3>
              <p className="text-gray-400 text-sm">Enhance text visibility</p>
            </div>
            <button
              onClick={() => handleSettingChange('highContrast', !settings.highContrast)}
              className={`w-12 h-6 rounded-full transition-all duration-300 ${
                settings.highContrast ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div 
                className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                  settings.highContrast ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-8 py-3 rounded-2xl font-medium text-white transition-all duration-300 hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${colors[0]}60, ${colors[1]}80)`,
            boxShadow: `0 10px 30px ${colors[0]}20`
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;