import React, { useState, useEffect } from 'react';
import EmotionTimeline from './components/EmotionTimeline';
import EarthConnectionScore from './components/EarthConnectionScore';
import SettingsModal from './components/SettingsModal';
import { exportAsImage } from './utils/exportUtils';

function App() {
  const [emotionalText, setEmotionalText] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [showSettings, setShowSettings] = useState(false);
  const [earthTrend, setEarthTrend] = useState('');

  const emotionColors = {
    joy: ['#FFD700', '#FF6B6B', '#4ECDC4'],
    sadness: ['#4A90E2', '#7B68EE', '#87CEEB'],
    anxiety: ['#FF6B6B', '#FF8E53', '#FF6B9D'],
    calm: ['#4ECDC4', '#45B7D1', '#96CEB4'],
    anger: ['#FF4757', '#FF3838', '#FF6B6B'],
    hope: ['#A8E6CF', '#88D8C0', '#78E08F'],
    fear: ['#6C5CE7', '#A29BFE', '#74B9FF'],
    neutral: ['#667EEA', '#764BA2', '#667EEA'],
    contemplative: ['#9B59B6', '#8E44AD', '#BB8FCE']
  };

  const getEmotionFromText = (text) => {
    const emotions = ['joy', 'sadness', 'anxiety', 'calm', 'anger', 'hope', 'fear'];
    for (let emotion of emotions) {
      if (text.toLowerCase().includes(emotion)) return emotion;
    }
    if (text.toLowerCase().includes('happy') || text.toLowerCase().includes('excited')) return 'joy';
    if (text.toLowerCase().includes('worried') || text.toLowerCase().includes('nervous')) return 'anxiety';
    if (text.toLowerCase().includes('peaceful') || text.toLowerCase().includes('relaxed')) return 'calm';
    if (text.toLowerCase().includes('mad') || text.toLowerCase().includes('frustrated')) return 'anger';
    return 'contemplative';
  };

  useEffect(() => {
    if (emotionalText) {
      setCurrentEmotion(getEmotionFromText(emotionalText));
    }
  }, [emotionalText]);

  useEffect(() => {
    if (response && response.success) {
      setCurrentEmotion(response.data.emotionAnalysis.primaryEmotion);
    }
  }, [response]);

  const colors = emotionColors[currentEmotion];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/oracle/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emotionalText,
          latitude: 37.7749,
          longitude: -122.4194
        })
      });
      
      const data = await res.json();
      console.log('API Response:', data); // Debug log
      setResponse(data);
      
      // Mock earth trend for demo
      setEarthTrend('Air quality is improving today, supporting clearer thinking and enhanced focus.');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-gray-900 transition-all duration-[3000ms] ease-in-out"
      style={{
        background: `radial-gradient(ellipse at top, ${colors[0]}15, transparent 50%), 
                     radial-gradient(ellipse at bottom left, ${colors[1]}10, transparent 50%),
                     radial-gradient(ellipse at bottom right, ${colors[2]}10, transparent 50%),
                     linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)`
      }}
    >
      {/* Mystical Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: colors[i % 3],
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 animate-bounce"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              background: `radial-gradient(circle, ${colors[i % 3]}30, transparent 70%)`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed top-6 right-6 z-20 p-3 rounded-full backdrop-blur-md border border-gray-600/50 transition-all duration-300 hover:scale-110"
        style={{
          background: 'rgba(15,15,35,0.8)',
          color: 'white'
        }}
      >
        ⚙️
      </button>

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div 
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 shadow-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${colors[0]}40, ${colors[1]}60)`,
                  boxShadow: `0 0 50px ${colors[0]}30`
                }}
              >
                <img 
                  src="/seo.png" 
                  alt="Sentient Earth Oracle" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 tracking-wide">
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  Sentient Earth Oracle
                </span>
              </h1>
              <p className="text-gray-300 text-lg">Unveiling the mysteries between your soul and the cosmos</p>
            </div>
          </div>
          
          {/* Main Oracle Card */}
          <div 
            className="backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/50 mb-8"
            style={{
              background: `linear-gradient(135deg, rgba(15,15,35,0.8), rgba(26,26,46,0.6))`,
              boxShadow: `0 25px 50px -12px ${colors[0]}20, inset 0 1px 0 rgba(255,255,255,0.1)`
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  ✨ Share your inner truth with the Oracle
                </label>
                <textarea
                  value={emotionalText}
                  onChange={(e) => setEmotionalText(e.target.value)}
                  placeholder="The shadows of anxiety cloud my thoughts, and I seek clarity in this darkness..."
                  className="w-full h-40 p-6 rounded-2xl bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none backdrop-blur-sm transition-all duration-500"
                  style={{
                    focusRingColor: colors[0]
                  }}
                  required
                  minLength={10}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || emotionalText.length < 10}
                className="w-full py-4 rounded-2xl font-medium text-white transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${colors[0]}80, ${colors[1]}60, ${colors[2]}80)`,
                  boxShadow: `0 10px 30px ${colors[0]}40`
                }}
              >
                <div className="relative z-10">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div 
                        className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"
                      />
                      The Oracle communes with the cosmos...
                    </div>
                  ) : (
                    '🌟 Consult the Oracle'
                  )}
                </div>
              </button>
            </form>
          </div>
          
          {/* Emotion Timeline */}
          <EmotionTimeline colors={colors} />
          
          {/* Debug Info */}
          {response && (
            <div className="text-white text-sm mb-4 p-4 bg-gray-800 rounded">
              Response Status: {response.success ? 'Success' : 'Failed'}
              <br />Response Data: {response.data ? 'Present' : 'Missing'}
            </div>
          )}
          
          {/* Oracle Response */}
          {response && response.success && (
            <div id="oracle-response" className="space-y-8 animate-fade-in">
              {/* Scores Row */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Vibe Score */}
                <div 
                className="backdrop-blur-xl rounded-3xl p-8 text-center border border-gray-700/50"
                style={{
                  background: `linear-gradient(135deg, rgba(15,15,35,0.9), rgba(26,26,46,0.7))`,
                  boxShadow: `0 25px 50px -12px ${colors[0]}30, inset 0 1px 0 rgba(255,255,255,0.1)`
                }}
              >
                <div className="mb-4">
                  <div className="text-6xl mb-2">🌌</div>
                  <h2 className="text-2xl font-bold text-white mb-4">Cosmic Alignment</h2>
                </div>
                <div 
                  className="text-7xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})` 
                  }}
                >
                  {response.data.vibeScore}
                </div>
                <p className="text-gray-300 text-lg">Your soul's resonance with Earth's energy</p>
                </div>
                
                {/* Earth Connection Score */}
                {response.data.earthConnectionScore && (
                  <EarthConnectionScore 
                    score={response.data.earthConnectionScore} 
                    colors={colors} 
                  />
                )}
              </div>

              {/* Oracle's Prophecy */}
              <div 
                className="backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                style={{
                  background: `linear-gradient(135deg, rgba(15,15,35,0.9), rgba(26,26,46,0.7))`,
                  boxShadow: `0 25px 50px -12px ${colors[1]}20, inset 0 1px 0 rgba(255,255,255,0.1)`
                }}
              >
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🔮</div>
                  <h3 className="text-2xl font-bold text-white">The Oracle Speaks</h3>
                </div>
                <div 
                  className="p-6 rounded-2xl border border-gray-600/30 relative"
                  style={{
                    background: `linear-gradient(135deg, ${colors[0]}10, ${colors[1]}05)`
                  }}
                >
                  <div className="absolute top-4 left-4 text-4xl opacity-30">"</div>
                  <p className="text-gray-200 leading-relaxed text-lg italic px-8 py-4">
                    {response.data.narrative}
                  </p>
                  <div className="absolute bottom-4 right-4 text-4xl opacity-30 rotate-180">"</div>
                </div>
                
                {/* Earth Trend Insight */}
                {earthTrend && (
                  <div 
                    className="mt-4 p-4 rounded-xl border border-gray-600/30"
                    style={{
                      background: `linear-gradient(135deg, ${colors[1]}08, transparent)`
                    }}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">🌍</span>
                      <span className="text-white font-medium text-sm">Earth Trend</span>
                    </div>
                    <p className="text-gray-300 text-sm">{earthTrend}</p>
                  </div>
                )}
              </div>

              {/* Mystical Insights */}
              <div 
                className="backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                style={{
                  background: `linear-gradient(135deg, rgba(15,15,35,0.9), rgba(26,26,46,0.7))`,
                  boxShadow: `0 25px 50px -12px ${colors[2]}20, inset 0 1px 0 rgba(255,255,255,0.1)`
                }}
              >
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">✨</div>
                  <h3 className="text-2xl font-bold text-white">Ancient Wisdom</h3>
                </div>
                <div className="space-y-4">
                  {response.data.insights.map((insight, i) => (
                    <div 
                      key={i} 
                      className="flex items-start p-4 rounded-xl border border-gray-600/30"
                      style={{
                        background: `linear-gradient(135deg, ${colors[i % 3]}08, transparent)`
                      }}
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold"
                        style={{ 
                          background: `linear-gradient(135deg, ${colors[i % 3]}60, ${colors[(i + 1) % 3]}40)`,
                          color: 'white'
                        }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-gray-200 leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sacred Actions */}
              <div 
                className="backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                style={{
                  background: `linear-gradient(135deg, rgba(15,15,35,0.9), rgba(26,26,46,0.7))`,
                  boxShadow: `0 25px 50px -12px ${colors[0]}20, inset 0 1px 0 rgba(255,255,255,0.1)`
                }}
              >
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🌟</div>
                  <h3 className="text-2xl font-bold text-white">Sacred Rituals</h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {response.data.actions.map((action, index) => (
                    <div 
                      key={action.id} 
                      className="p-6 rounded-2xl border border-gray-600/30 transition-all duration-500 hover:scale-105 cursor-pointer group"
                      style={{
                        background: `linear-gradient(135deg, ${colors[index % 3]}15, ${colors[(index + 1) % 3]}05)`,
                        boxShadow: `0 10px 25px ${colors[index % 3]}10`
                      }}
                    >
                      <div className="flex items-center mb-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center mr-4 text-xl group-hover:scale-110 transition-transform"
                          style={{ 
                            background: `linear-gradient(135deg, ${colors[index % 3]}60, ${colors[(index + 1) % 3]}40)` 
                          }}
                        >
                          {index === 0 ? '🧘' : index === 1 ? '🌿' : index === 2 ? '💫' : '🔥'}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-lg">{action.title}</h4>
                          <span className="text-xs text-gray-400 capitalize">{action.difficulty} • {action.category}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4 leading-relaxed">{action.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">⏱️ {action.timeEstimate}</span>
                        <div 
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            background: `${colors[index % 3]}20`,
                            color: colors[index % 3]
                          }}
                        >
                          {action.safetyLevel}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="text-center pt-8 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={async () => {
                      const success = await exportAsImage('oracle-response', 'oracle-reading');
                      if (success) {
                        alert('Oracle reading exported successfully!');
                      } else {
                        alert('Export failed. Please try again.');
                      }
                    }}
                    className="py-3 px-6 rounded-2xl font-medium text-white transition-all duration-500 transform hover:scale-105 backdrop-blur-sm"
                    style={{
                      background: `linear-gradient(135deg, ${colors[0]}60, ${colors[1]}80)`,
                      boxShadow: `0 10px 30px ${colors[0]}20`
                    }}
                  >
                    📸 Export as Image
                  </button>
                  
                  <button
                    onClick={() => setResponse(null)}
                    className="py-3 px-6 rounded-2xl font-medium text-white transition-all duration-500 transform hover:scale-105 backdrop-blur-sm"
                    style={{
                      background: `linear-gradient(135deg, ${colors[1]}60, ${colors[2]}80)`,
                      boxShadow: `0 10px 30px ${colors[1]}20`
                    }}
                  >
                    🌙 Seek Another Vision
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        colors={colors} 
      />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;