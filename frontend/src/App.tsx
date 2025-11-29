import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmotionInput from './components/EmotionInput';
import OracleResponseDisplay from './components/OracleResponseDisplay';
import ApiService from './services/api';
import { LocationService } from './utils/location';
import { OracleResponse } from './types';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [oracleResponse, setOracleResponse] = useState<OracleResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEmotionSubmit = async (emotionalText: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get user location
      const location = await LocationService.getCurrentLocation();
      
      // Generate oracle response
      const response = await ApiService.generateOracleResponse({
        emotionalText,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      setOracleResponse(response);
    } catch (err: any) {
      console.error('Error generating oracle response:', err);
      setError(err.message || 'Failed to generate oracle response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewReading = () => {
    setOracleResponse(null);
    setError(null);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="oracle-card p-4 mb-6 max-w-2xl mx-auto border-red-200 bg-red-50"
            >
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <div>
                  <h3 className="font-medium text-red-800">Oracle Unavailable</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
              <button
                onClick={() => setError(null)}
                className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {!oracleResponse ? (
            <EmotionInput onSubmit={handleEmotionSubmit} isLoading={isLoading} />
          ) : (
            <OracleResponseDisplay 
              response={oracleResponse} 
              onNewReading={handleNewReading} 
            />
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center mt-12 text-gray-500 text-sm"
        >
          <p>🌍 Sentient Earth Oracle • Connecting emotions with Earth's wisdom</p>
          <p className="mt-1">Built for AWS Global Vibe Hackathon 2025</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;