import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EmotionAnalysis, EmotionScore } from '../models/index';

dotenv.config();

export class EmotionAnalysisAgent {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async analyzeEmotion(text: string): Promise<EmotionAnalysis> {
    const prompt = `
Analyze the emotional content of the following text and return a JSON response with this exact structure:

{
  "emotions": [
    {"emotion": "joy", "confidence": 0.85, "intensity": 7},
    {"emotion": "hope", "confidence": 0.60, "intensity": 5}
  ],
  "primaryEmotion": "joy",
  "secondaryEmotion": "hope",
  "overallIntensity": 6
}

Emotions to detect: joy, sadness, anxiety, calm, anger, hope, fear, neutral
- confidence: 0-1 (how certain you are this emotion is present)
- intensity: 1-10 (how strong the emotion is)
- overallIntensity: 1-10 (overall emotional intensity)

Only include emotions with confidence > 0.3. Sort by confidence descending.

Text to analyze: "${text}"

Return only the JSON, no other text.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();
      
      if (!content) throw new Error('No response from Gemini');

      const analysis = JSON.parse(content);
      
      return {
        primaryEmotion: analysis.primaryEmotion,
        secondaryEmotion: analysis.secondaryEmotion,
        emotions: analysis.emotions,
        overallIntensity: analysis.overallIntensity,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Emotion analysis error:', error);
      
      // Fallback analysis
      return {
        primaryEmotion: 'neutral',
        emotions: [{ emotion: 'neutral', confidence: 0.8, intensity: 5 }],
        overallIntensity: 5,
        timestamp: new Date()
      };
    }
  }

  private calculateVibeAlignment(emotions: EmotionScore[], earthData: any): number {
    // Simple vibe calculation - would be more sophisticated in production
    const positiveEmotions = ['joy', 'hope', 'calm'];
    const negativeEmotions = ['sadness', 'anxiety', 'anger', 'fear'];
    
    let emotionalScore = 0;
    emotions.forEach(e => {
      if (positiveEmotions.includes(e.emotion)) {
        emotionalScore += e.confidence * e.intensity;
      } else if (negativeEmotions.includes(e.emotion)) {
        emotionalScore -= e.confidence * e.intensity;
      }
    });
    
    // Environmental factors
    let environmentScore = 50;
    if (earthData.weather.condition === 'Clear') environmentScore += 20;
    if (earthData.airQuality.aqi < 50) environmentScore += 15;
    if (earthData.weather.temperature > 15 && earthData.weather.temperature < 25) environmentScore += 10;
    
    const vibeScore = Math.max(0, Math.min(100, 50 + emotionalScore + (environmentScore - 50) * 0.3));
    return Math.round(vibeScore);
  }
}