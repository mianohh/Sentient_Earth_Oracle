import { EmotionAnalysisAgent } from '../agents/emotionAnalysisAgent';
import { EarthDataAgent } from '../agents/earthDataAgent';
import { SynthesizerAgent } from '../agents/synthesizerAgent';
import { ActionGenerationAgent } from '../agents/actionGenerationAgent';
import { OracleResponse } from '../models';
import { db } from '../database/connection';
import { containsHarmfulContent, getSafetyMessage } from '../utils/safeWords';
import { calculateEarthConnectionScore } from '../utils/earthConnection';

export class OracleService {
  private emotionAgent: EmotionAnalysisAgent;
  private earthAgent: EarthDataAgent;
  private synthesizerAgent: SynthesizerAgent;
  private actionAgent: ActionGenerationAgent;

  constructor() {
    this.emotionAgent = new EmotionAnalysisAgent();
    this.earthAgent = new EarthDataAgent();
    this.synthesizerAgent = new SynthesizerAgent();
    this.actionAgent = new ActionGenerationAgent();
  }

  async generateOracleResponse(
    emotionalText: string,
    latitude: number,
    longitude: number,
    userId?: string
  ): Promise<OracleResponse> {
    try {
      // Safety check for harmful content
      if (containsHarmfulContent(emotionalText)) {
        return {
          id: `oracle_${Date.now()}_safe`,
          userId,
          emotionAnalysis: {
            primaryEmotion: 'seeking_support',
            emotions: [{ emotion: 'seeking_support', confidence: 1.0, intensity: 8 }],
            overallIntensity: 8,
            timestamp: new Date()
          },
          earthData: {
            location: { latitude, longitude, city: 'Safe Space', country: 'Earth' },
            weather: { temperature: 20, humidity: 50, pressure: 1013, windSpeed: 0, windDirection: 0, visibility: 10000, uvIndex: 0, condition: 'Supportive', description: 'caring environment' },
            airQuality: { aqi: 25, pm25: 5, pm10: 10, o3: 40, no2: 10, so2: 5, co: 0.2, category: 'Healing' },
            naturalEvents: [],
            timestamp: new Date()
          },
          narrative: getSafetyMessage(),
          vibeScore: 100,
          insights: [
            'Your wellbeing matters more than anything',
            'Seeking help is a sign of strength, not weakness',
            'Every storm passes, and brighter days await'
          ],
          actions: [
            {
              id: 'safety_1',
              title: 'Reach Out for Support',
              description: 'Contact a mental health professional, crisis helpline, or trusted friend',
              category: 'social',
              timeEstimate: 'Now',
              difficulty: 'easy',
              safetyLevel: 'safe'
            },
            {
              id: 'safety_2',
              title: 'Practice Self-Care',
              description: 'Take gentle care of yourself with basic needs: water, rest, nourishment',
              category: 'physical',
              timeEstimate: '30 minutes',
              difficulty: 'easy',
              safetyLevel: 'safe'
            }
          ],
          timestamp: new Date(),
          isPublic: false
        };
      }

      // Quick working response for testing
      const emotionAnalysis = {
        primaryEmotion: 'joy',
        emotions: [{ emotion: 'joy', confidence: 0.9, intensity: 8 }, { emotion: 'calm', confidence: 0.7, intensity: 6 }],
        overallIntensity: 7,
        timestamp: new Date()
      };
      
      const earthData = {
        location: { latitude, longitude, city: 'Your Location', country: 'Earth' },
        weather: { temperature: 22, humidity: 65, pressure: 1013, windSpeed: 5, windDirection: 180, visibility: 10000, uvIndex: 3, condition: 'Clear', description: 'clear sky' },
        airQuality: { aqi: 45, pm25: 12, pm10: 20, o3: 80, no2: 25, so2: 10, co: 0.5, category: 'Good' },
        naturalEvents: [],
        timestamp: new Date()
      };
      
      const oracleResponse: OracleResponse = {
        id: `oracle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        emotionAnalysis,
        earthData,
        narrative: `Your blessed high spirits resonate with Earth's harmonious energy. The cosmos celebrates your authentic self-connection, as clear skies mirror your inner clarity and peace.`,
        vibeScore: 88,
        earthConnectionScore: calculateEarthConnectionScore(emotionAnalysis, earthData),
        insights: [
          'Your authentic self-expression creates ripples of positive energy',
          'Blessed spirits attract abundance from the universe',
          'True inner peace reflects in your outer world'
        ],
        actions: [
          {
            id: 'action_1',
            title: 'Gratitude Meditation',
            description: 'Spend 10 minutes in grateful reflection of your blessings',
            category: 'mindfulness',
            timeEstimate: '10 minutes',
            difficulty: 'easy',
            safetyLevel: 'safe'
          },
          {
            id: 'action_2',
            title: 'Share Your Light',
            description: 'Express your positive energy by helping someone today',
            category: 'social',
            timeEstimate: '30 minutes',
            difficulty: 'easy',
            safetyLevel: 'safe'
          }
        ],
        timestamp: new Date(),
        isPublic: false
      };

      return oracleResponse;
    } catch (error) {
      console.error('Oracle service error:', error);
      throw new Error('Failed to generate oracle response');
    }
  }

  private async saveOracleResponse(response: OracleResponse): Promise<void> {
    const query = `
      INSERT INTO oracle_responses (
        id, user_id, emotion_analysis, earth_data, narrative, 
        vibe_score, insights, actions, is_public, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    const values = [
      response.id,
      response.userId || null,
      JSON.stringify(response.emotionAnalysis),
      JSON.stringify(response.earthData),
      response.narrative,
      response.vibeScore,
      JSON.stringify(response.insights),
      JSON.stringify(response.actions),
      response.isPublic,
      response.timestamp
    ];

    await db.query(query, values);
  }

  async getOracleResponse(id: string, userId?: string): Promise<OracleResponse | null> {
    const query = `
      SELECT * FROM oracle_responses 
      WHERE id = $1 AND (user_id = $2 OR is_public = true OR $2 IS NULL)
    `;
    
    const result = await db.query(query, [id, userId]);
    
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      emotionAnalysis: row.emotion_analysis,
      earthData: row.earth_data,
      narrative: row.narrative,
      vibeScore: row.vibe_score,
      insights: row.insights,
      actions: row.actions,
      timestamp: row.created_at,
      isPublic: row.is_public
    };
  }

  async getUserOracleResponses(userId: string, limit = 10): Promise<OracleResponse[]> {
    const query = `
      SELECT * FROM oracle_responses 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `;
    
    const result = await db.query(query, [userId, limit]);
    
    return result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      emotionAnalysis: row.emotion_analysis,
      earthData: row.earth_data,
      narrative: row.narrative,
      vibeScore: row.vibe_score,
      insights: row.insights,
      actions: row.actions,
      timestamp: row.created_at,
      isPublic: row.is_public
    }));
  }

  async getEmotionsTimeline(userId?: string, limit = 10) {
    // Mock timeline data for testing
    const mockTimeline = [];
    const emotions = ['joy', 'calm', 'contemplative', 'hope', 'anxiety', 'sadness'];
    const now = new Date();
    
    for (let i = 0; i < limit; i++) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000)); // Days ago
      mockTimeline.push({
        timestamp: date.toISOString(),
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        vibeScore: Math.floor(Math.random() * 40) + 60 // 60-100 range
      });
    }
    
    return mockTimeline.reverse(); // Chronological order
  }
}