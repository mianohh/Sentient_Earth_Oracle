import { EmotionAnalysis, EarthData } from '../models';

export function calculateEarthConnectionScore(
  emotionAnalysis: EmotionAnalysis,
  earthData: EarthData
): number {
  // AQI component (0-1, inverted so lower AQI = higher score)
  const aqiScore = Math.max(0, (150 - earthData.airQuality.aqi) / 150);
  
  // Weather pleasantness (0-1)
  const tempScore = getTemperatureScore(earthData.weather.temperature);
  const humidityScore = getHumidityScore(earthData.weather.humidity);
  const weatherScore = (tempScore + humidityScore) / 2;
  
  // Emotion positivity (0-1)
  const emotionScore = getEmotionPositivityScore(emotionAnalysis);
  
  // Weighted combination
  const connectionScore = (
    aqiScore * 0.3 +        // 30% air quality
    weatherScore * 0.3 +    // 30% weather comfort
    emotionScore * 0.4      // 40% emotional state
  );
  
  return Math.round(connectionScore * 100);
}

function getTemperatureScore(temp: number): number {
  // Optimal range: 18-24°C
  if (temp >= 18 && temp <= 24) return 1.0;
  if (temp >= 15 && temp <= 27) return 0.8;
  if (temp >= 10 && temp <= 30) return 0.6;
  if (temp >= 5 && temp <= 35) return 0.4;
  return 0.2;
}

function getHumidityScore(humidity: number): number {
  // Optimal range: 40-60%
  if (humidity >= 40 && humidity <= 60) return 1.0;
  if (humidity >= 30 && humidity <= 70) return 0.8;
  if (humidity >= 20 && humidity <= 80) return 0.6;
  return 0.4;
}

function getEmotionPositivityScore(analysis: EmotionAnalysis): number {
  const positiveEmotions = ['joy', 'hope', 'calm', 'contemplative'];
  const negativeEmotions = ['sadness', 'anxiety', 'anger', 'fear'];
  
  let positiveWeight = 0;
  let negativeWeight = 0;
  
  analysis.emotions.forEach(emotion => {
    const weight = emotion.confidence * (emotion.intensity / 10);
    
    if (positiveEmotions.includes(emotion.emotion)) {
      positiveWeight += weight;
    } else if (negativeEmotions.includes(emotion.emotion)) {
      negativeWeight += weight;
    }
  });
  
  // Normalize to 0-1 range
  const totalWeight = positiveWeight + negativeWeight;
  if (totalWeight === 0) return 0.5; // Neutral
  
  return positiveWeight / totalWeight;
}