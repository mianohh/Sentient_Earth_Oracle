import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EmotionAnalysis, EarthData, ActionRecommendation } from '../models/index';

dotenv.config({ path: '../../../.env' });

export class ActionGenerationAgent {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateActions(
    emotionAnalysis: EmotionAnalysis,
    earthData: EarthData,
    vibeScore: number
  ): Promise<ActionRecommendation[]> {
    const safetyLevel = this.assessSafetyLevel(earthData);
    
    const prompt = `
Generate 4-5 personalized action recommendations based on emotions and environmental conditions.

EMOTION CONTEXT:
- Primary: ${emotionAnalysis.primaryEmotion}
- Secondary: ${emotionAnalysis.secondaryEmotion || 'none'}
- Intensity: ${emotionAnalysis.overallIntensity}/10

ENVIRONMENT CONTEXT:
- Location: ${earthData.location.city}
- Weather: ${earthData.weather.condition}, ${earthData.weather.temperature}°C
- Air Quality: ${earthData.airQuality.category} (AQI: ${earthData.airQuality.aqi})
- Safety Level: ${safetyLevel}

VIBE SCORE: ${vibeScore}/100

Create actions that:
- Address the primary emotion constructively
- Consider environmental conditions and safety
- Offer variety across categories
- Are specific and actionable
- Include time estimates

Return JSON array with this structure:
[
  {
    "title": "Action title (3-6 words)",
    "description": "Detailed description (20-40 words)",
    "category": "physical|mindfulness|social|environmental",
    "timeEstimate": "5-10 minutes|30 minutes|1 hour|etc",
    "difficulty": "easy|medium|hard",
    "safetyLevel": "safe|caution|warning"
  }
]

Categories to include:
- physical: Movement, exercise, outdoor activities
- mindfulness: Meditation, breathing, reflection
- social: Connection, communication, community
- environmental: Nature interaction, eco-actions

Safety considerations:
- If AQI > 150: avoid outdoor physical activities
- If weather is severe: indoor alternatives
- Always prioritize user safety

Return only the JSON array, no other text.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();
      
      if (!content) throw new Error('No response from Gemini');

      const actions = JSON.parse(content);
      
      return actions.map((action: any, index: number) => ({
        id: `action_${Date.now()}_${index}`,
        ...action
      }));
    } catch (error) {
      console.error('Action generation error:', error);
      
      // Fallback actions
      return this.getFallbackActions(emotionAnalysis, earthData, safetyLevel);
    }
  }

  private assessSafetyLevel(earthData: EarthData): 'safe' | 'caution' | 'warning' {
    if (earthData.airQuality.aqi > 200 || 
        earthData.naturalEvents.length > 0 ||
        earthData.weather.condition === 'Storm') {
      return 'warning';
    }
    
    if (earthData.airQuality.aqi > 100 || 
        earthData.weather.temperature < -10 || 
        earthData.weather.temperature > 40) {
      return 'caution';
    }
    
    return 'safe';
  }

  private getFallbackActions(
    emotions: EmotionAnalysis, 
    earthData: EarthData, 
    safetyLevel: string
  ): ActionRecommendation[] {
    const baseActions: ActionRecommendation[] = [
      {
        id: 'fallback_1',
        title: 'Deep Breathing Exercise',
        description: 'Take 10 deep breaths, focusing on the connection between your inner state and the air around you.',
        category: 'mindfulness',
        timeEstimate: '5 minutes',
        difficulty: 'easy',
        safetyLevel: 'safe'
      },
      {
        id: 'fallback_2',
        title: 'Emotional Journaling',
        description: 'Write about how your current emotions relate to the environment around you.',
        category: 'mindfulness',
        timeEstimate: '15 minutes',
        difficulty: 'easy',
        safetyLevel: 'safe'
      },
      {
        id: 'fallback_3',
        title: 'Window Meditation',
        description: 'Sit by a window and observe the weather while reflecting on your emotional state.',
        category: 'mindfulness',
        timeEstimate: '10 minutes',
        difficulty: 'easy',
        safetyLevel: 'safe'
      }
    ];

    // Add weather-appropriate action
    if (safetyLevel === 'safe' && earthData.weather.temperature > 10) {
      baseActions.push({
        id: 'fallback_4',
        title: 'Nature Walk',
        description: 'Take a gentle walk outside to synchronize your emotions with the natural world.',
        category: 'physical',
        timeEstimate: '20 minutes',
        difficulty: 'easy',
        safetyLevel: 'safe'
      });
    } else {
      baseActions.push({
        id: 'fallback_4',
        title: 'Indoor Stretching',
        description: 'Gentle stretching while visualizing the outdoor environment.',
        category: 'physical',
        timeEstimate: '15 minutes',
        difficulty: 'easy',
        safetyLevel: 'safe'
      });
    }

    return baseActions;
  }
}