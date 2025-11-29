import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface EmotionInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const EmotionInput: React.FC<EmotionInputProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmit(text.trim());
    }
  };

  const placeholderTexts = [
    "I'm feeling overwhelmed by everything happening around me...",
    "Today brought unexpected joy and I want to understand why...",
    "There's a restlessness in my heart that I can't quite name...",
    "I feel deeply connected to something larger than myself...",
  ];

  const [placeholder] = useState(
    placeholderTexts[Math.floor(Math.random() * placeholderTexts.length)]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="oracle-card p-8 max-w-2xl mx-auto"
    >
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🌍 Sentient Earth Oracle
        </h1>
        <p className="text-gray-600">
          Share your emotions and discover their connection to the Earth
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="emotion-text" className="block text-sm font-medium text-gray-700 mb-2">
            How are you feeling right now?
          </label>
          <textarea
            id="emotion-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-earth-500 focus:border-transparent resize-none"
            disabled={isLoading}
            minLength={10}
            maxLength={1000}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {text.length}/1000
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={text.length < 10 || isLoading}
          className="w-full bg-gradient-to-r from-earth-600 to-earth-700 text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-earth-700 hover:to-earth-800 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Consulting the Oracle...
            </div>
          ) : (
            'Seek Wisdom from the Earth'
          )}
        </motion.button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Your location will be used to gather environmental data
      </div>
    </motion.div>
  );
};

export default EmotionInput;