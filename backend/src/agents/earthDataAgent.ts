import { EarthDataService } from '../services/earthDataService';
import { EarthData } from '../models/index';

export class EarthDataAgent {
  private earthDataService: EarthDataService;

  constructor() {
    this.earthDataService = new EarthDataService();
  }

  async getEarthData(latitude: number, longitude: number): Promise<EarthData> {
    const earthData = await this.earthDataService.getEarthData(latitude, longitude);
    return earthData;
  }

  async analyzeEarthData(latitude: number, longitude: number): Promise<{
    earthData: EarthData;
    interpretation: string;
    environmentalFactors: string[];
    trendInsight: string;
  }> {
    const earthData = await this.earthDataService.getEarthData(latitude, longitude);
    
    const interpretation = this.interpretEarthData(earthData);
    const environmentalFactors = this.extractEnvironmentalFactors(earthData);
    const trendInsight = this.generateTrendInsight(earthData);

    return {
      earthData,
      interpretation,
      environmentalFactors,
      trendInsight
    };
  }

  private interpretEarthData(data: EarthData): string {
    const { weather, airQuality, naturalEvents } = data;
    
    let interpretation = `The environment around ${data.location.city} presents `;
    
    // Weather interpretation
    if (weather.temperature < 0) {
      interpretation += "a crisp, cold atmosphere that invites introspection. ";
    } else if (weather.temperature > 30) {
      interpretation += "intense warmth that mirrors passionate emotions. ";
    } else {
      interpretation += "a comfortable climate that supports emotional balance. ";
    }

    // Air quality interpretation
    if (airQuality.aqi > 150) {
      interpretation += "The air carries the weight of human activity, suggesting a need for cleansing and renewal. ";
    } else if (airQuality.aqi < 50) {
      interpretation += "Pure, clean air that allows for deep breathing and clarity of thought. ";
    } else {
      interpretation += "Moderately clear air that supports steady contemplation. ";
    }

    // Weather condition interpretation
    switch (weather.condition.toLowerCase()) {
      case 'clear':
        interpretation += "Clear skies offer unlimited possibilities and hope.";
        break;
      case 'clouds':
        interpretation += "Gentle clouds provide a soft backdrop for reflection.";
        break;
      case 'rain':
        interpretation += "Rain cleanses both earth and spirit, washing away what no longer serves.";
        break;
      case 'storm':
        interpretation += "Storms mirror inner turbulence but promise transformation.";
        break;
      default:
        interpretation += "The sky holds mysteries that mirror our inner landscape.";
    }

    return interpretation;
  }

  private extractEnvironmentalFactors(data: EarthData): string[] {
    const factors: string[] = [];
    
    // Temperature factors
    if (data.weather.temperature < 5) factors.push("cold_temperature");
    if (data.weather.temperature > 25) factors.push("warm_temperature");
    
    // Air quality factors
    if (data.airQuality.aqi > 100) factors.push("poor_air_quality");
    if (data.airQuality.aqi < 50) factors.push("excellent_air_quality");
    
    // Weather condition factors
    factors.push(`weather_${data.weather.condition.toLowerCase()}`);
    
    // Wind factors
    if (data.weather.windSpeed > 10) factors.push("windy_conditions");
    
    // Humidity factors
    if (data.weather.humidity > 80) factors.push("high_humidity");
    if (data.weather.humidity < 30) factors.push("low_humidity");
    
    // Natural events
    if (data.naturalEvents.length > 0) {
      factors.push("natural_events_nearby");
    }

    return factors;
  }

  private generateTrendInsight(data: EarthData): string {
    // Mock trend analysis - in production would compare with historical data
    const insights = [];
    
    if (data.airQuality.aqi > 75) {
      insights.push('Air quality is declining today, which may affect mental clarity and energy levels.');
    } else if (data.airQuality.aqi < 50) {
      insights.push('Exceptionally clean air today supports deeper breathing and enhanced focus.');
    }
    
    if (data.weather.temperature > 25) {
      insights.push('Rising temperatures may intensify emotional responses and energy.');
    } else if (data.weather.temperature < 10) {
      insights.push('Cooler conditions encourage introspection and calm contemplation.');
    }
    
    return insights.length > 0 ? insights.join(' ') : 'Environmental conditions are stable, supporting balanced emotional states.';
  }
}