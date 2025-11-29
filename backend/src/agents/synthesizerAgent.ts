import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EmotionAnalysis, EarthData } from '../models/index';

dotenv.config({ path: '../../../.env' });

export class SynthesizerAgent {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async synthesizeInsights(
    emotionAnalysis: EmotionAnalysis,
    earthData: EarthData,
    earthInterpretation: string
  ): Promise<{
    narrative: string;
    vibeScore: number;
    insights: string[];
  }> {
    const vibeScore = this.calculateVibeScore(emotionAnalysis, earthData);
    
    const prompt = `
Create a poetic, meaningful narrative that connects human emotions with Earth's current state.

EMOTION ANALYSIS:
- Primary: ${emotionAnalysis.primaryEmotion}
- Secondary: ${emotionAnalysis.secondaryEmotion || 'none'}
- Intensity: ${emotionAnalysis.overallIntensity}/10
- Emotions: ${emotionAnalysis.emotions.map(e => `${e.emotion} (${Math.round(e.confidence * 100)}%)`).join(', ')}

EARTH DATA:
- Location: ${earthData.location.city}, ${earthData.location.country}
- Weather: ${earthData.weather.condition}, ${earthData.weather.temperature}°C
- Air Quality: ${earthData.airQuality.category} (AQI: ${earthData.airQuality.aqi})
- Environment: ${earthInterpretation}

VIBE SCORE: ${vibeScore}/100

Create a response with this JSON structure:
{
  "narrative": "A 2-3 paragraph poetic narrative connecting emotions and environment",
  "insights": ["3-5 meaningful insights about the connection", "Each insight should be profound", "Focus on universal truths"]
}

The narrative should:
- Be poetic and evocative
- Draw meaningful parallels between inner and outer worlds
- Acknowledge both harmony and contrast
- Offer wisdom and perspective
- Be 150-250 words

The insights should:
- Be profound and thought-provoking
- Connect emotions to environmental conditions
- Offer universal wisdom
- Be 10-20 words each

Return only the JSON, no other text.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();
      
      if (!content) throw new Error('No response from Gemini');

      const synthesis = JSON.parse(content);
      
      return {
        narrative: synthesis.narrative,
        vibeScore,
        insights: synthesis.insights
      };
    } catch (error) {
      console.error('Synthesis error:', error);
      
      // Fallback synthesis
      return {
        narrative: `In ${earthData.location.city}, where ${earthData.weather.condition.toLowerCase()} skies mirror your ${emotionAnalysis.primaryEmotion}, the earth whispers ancient truths. The ${earthData.weather.temperature}°C air carries both your emotions and the planet's breath, creating a symphony of connection that transcends the physical realm.`,
        vibeScore,
        insights: [
          "Inner weather often reflects outer conditions",
          "Emotions and environment dance in eternal partnership",
          "The earth holds space for all human feelings"
        ]
      };
    }
  }

  private calculateVibeScore(emotions: EmotionAnalysis, earthData: EarthData): number {
    const positiveEmotions = ['joy', 'hope', 'calm'];
    const negativeEmotions = ['sadness', 'anxiety', 'anger', 'fear'];
    
    // Emotional component (0-50)
    let emotionalScore = 25;
    emotions.emotions.forEach(e => {
      if (positiveEmotions.includes(e.emotion)) {
        emotionalScore += e.confidence * e.intensity * 2;
      } else if (negativeEmotions.includes(e.emotion)) {
        emotionalScore -= e.confidence * e.intensity * 1.5;
      }
    });
    
    // Environmental component (0-50)
    let environmentalScore = 25;
    
    // Weather factors
    if (earthData.weather.condition === 'Clear') environmentalScore += 10;
    else if (earthData.weather.condition === 'Rain') environmentalScore += 5;
    else if (earthData.weather.condition === 'Storm') environmentalScore -= 5;
    
    // Temperature comfort
    if (earthData.weather.temperature >= 18 && earthData.weather.temperature <= 24) {
      environmentalScore += 8;
    } else if (Math.abs(earthData.weather.temperature - 21) > 15) {
      environmentalScore -= 5;
    }
    
    // Air quality
    if (earthData.airQuality.aqi < 50) environmentalScore += 10;
    else if (earthData.airQuality.aqi > 150) environmentalScore -= 15;
    
    // Natural events
    if (earthData.naturalEvents.length > 0) {
      environmentalScore -= earthData.naturalEvents.length * 5;
    }
    
    const totalScore = Math.max(0, Math.min(100, emotionalScore + environmentalScore));
    return Math.round(totalScore);
  }
}