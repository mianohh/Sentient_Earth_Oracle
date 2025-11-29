import React from 'react';
import { motion } from 'framer-motion';
import { OracleResponse } from '../types';

interface OracleResponseDisplayProps {
  response: OracleResponse;
  onNewReading: () => void;
}

const OracleResponseDisplay: React.FC<OracleResponseDisplayProps> = ({ response, onNewReading }) => {
  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      joy: 'bg-emotion-joy text-yellow-900',
      sadness: 'bg-emotion-sadness text-blue-900',
      anxiety: 'bg-emotion-anxiety text-red-900',
      calm: 'bg-emotion-calm text-green-900',
      anger: 'bg-emotion-anger text-red-900',
      hope: 'bg-emotion-hope text-purple-900',
      fear: 'bg-emotion-fear text-gray-900',
      neutral: 'bg-emotion-neutral text-gray-900',
    };
    return colors[emotion] || 'bg-gray-200 text-gray-900';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      physical: '🏃‍♂️',
      mindfulness: '🧘‍♀️',
      social: '👥',
      environmental: '🌱',
    };
    return icons[category] || '✨';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'text-green-600',
      medium: 'text-yellow-600',
      hard: 'text-red-600',
    };
    return colors[difficulty] || 'text-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Vibe Score */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="oracle-card p-6 text-center"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your Vibe Score</h2>
        <div className="vibe-score">{response.vibeScore}</div>
        <div className="text-gray-600">Emotional-Environmental Alignment</div>
      </motion.div>

      {/* Emotions */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="oracle-card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Emotional Landscape</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {response.emotionAnalysis.emotions.map((emotion, index) => (
            <span
              key={index}
              className={`emotion-badge ${getEmotionColor(emotion.emotion)}`}
            >
              {emotion.emotion} ({Math.round(emotion.confidence * 100)}%)
            </span>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          Primary: <strong>{response.emotionAnalysis.primaryEmotion}</strong>
          {response.emotionAnalysis.secondaryEmotion && (
            <> • Secondary: <strong>{response.emotionAnalysis.secondaryEmotion}</strong></>
          )}
        </div>
      </motion.div>

      {/* Earth Data */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="oracle-card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Earth's Current State</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700">Location</div>
            <div className="text-gray-600">{response.earthData.location.city}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Weather</div>
            <div className="text-gray-600">{response.earthData.weather.condition}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Temperature</div>
            <div className="text-gray-600">{Math.round(response.earthData.weather.temperature)}°C</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Air Quality</div>
            <div className="text-gray-600">{response.earthData.airQuality.category}</div>
          </div>
        </div>
      </motion.div>

      {/* Narrative */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="oracle-card p-8"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Oracle's Wisdom</h3>
        <div className="text-gray-700 leading-relaxed text-lg italic text-center">
          "{response.narrative}"
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="oracle-card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Deeper Insights</h3>
        <ul className="space-y-2">
          {response.insights.map((insight, index) => (
            <li key={index} className="flex items-start">
              <span className="text-earth-600 mr-2">•</span>
              <span className="text-gray-700">{insight}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="oracle-card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended Actions</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {response.actions.map((action, index) => (
            <div key={action.id} className="action-card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-xl mr-2">{getCategoryIcon(action.category)}</span>
                  <h4 className="font-medium text-gray-800">{action.title}</h4>
                </div>
                <span className={`text-xs font-medium ${getDifficultyColor(action.difficulty)}`}>
                  {action.difficulty}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{action.description}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{action.timeEstimate}</span>
                <span className="capitalize">{action.category}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* New Reading Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="text-center"
      >
        <button
          onClick={onNewReading}
          className="bg-gradient-to-r from-earth-600 to-earth-700 text-white py-3 px-8 rounded-lg font-medium hover:from-earth-700 hover:to-earth-800 transition-all duration-300"
        >
          Seek Another Reading
        </button>
      </motion.div>
    </motion.div>
  );
};

export default OracleResponseDisplay;