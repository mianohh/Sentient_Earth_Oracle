export interface EmotionScore {
  emotion: string;
  confidence: number;
  intensity: number;
}

export interface EmotionAnalysis {
  primaryEmotion: string;
  secondaryEmotion?: string;
  emotions: EmotionScore[];
  overallIntensity: number;
  timestamp: Date;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  uvIndex: number;
  condition: string;
  description: string;
}

export interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  category: string;
}

export interface NaturalEvent {
  type: string;
  title: string;
  description: string;
  severity: string;
  distance: number;
  coordinates: [number, number];
  timestamp: Date;
}

export interface EarthData {
  location: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
  weather: WeatherData;
  airQuality: AirQualityData;
  naturalEvents: NaturalEvent[];
  timestamp: Date;
}

export interface ActionRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'physical' | 'mindfulness' | 'social' | 'environmental';
  timeEstimate: string;
  difficulty: 'easy' | 'medium' | 'hard';
  safetyLevel: 'safe' | 'caution' | 'warning';
}

export interface OracleResponse {
  id: string;
  userId?: string;
  emotionAnalysis: EmotionAnalysis;
  earthData: EarthData;
  narrative: string;
  vibeScore: number;
  earthConnectionScore?: number;
  insights: string[];
  actions: ActionRecommendation[];
  timestamp: Date;
  isPublic: boolean;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}