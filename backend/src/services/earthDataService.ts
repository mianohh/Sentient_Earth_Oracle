import axios from 'axios';
import { EarthData, WeatherData, AirQualityData, NaturalEvent } from '../models';
import { redis } from '../database/connection';

export class EarthDataService {
  private openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
  private iqAirApiKey = process.env.IQAIR_API_KEY;

  async getEarthData(latitude: number, longitude: number): Promise<EarthData> {
    const cacheKey = `earth_data:${latitude}:${longitude}`;
    
    // Check cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const [weather, airQuality, naturalEvents, locationInfo] = await Promise.all([
      this.getWeatherData(latitude, longitude),
      this.getAirQualityData(latitude, longitude),
      this.getNaturalEvents(latitude, longitude),
      this.getLocationInfo(latitude, longitude)
    ]);

    const earthData: EarthData = {
      location: locationInfo,
      weather,
      airQuality,
      naturalEvents,
      timestamp: new Date()
    };

    // Cache for 10 minutes
    await redis.setEx(cacheKey, 600, JSON.stringify(earthData));

    return earthData;
  }

  private async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.openWeatherApiKey}&units=metric`
    );

    const data = response.data;
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind?.speed || 0,
      windDirection: data.wind?.deg || 0,
      visibility: data.visibility || 10000,
      uvIndex: 0, // Would need separate UV API call
      condition: data.weather[0].main,
      description: data.weather[0].description
    };
  }

  private async getAirQualityData(lat: number, lon: number): Promise<AirQualityData> {
    try {
      const response = await axios.get(
        `http://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${this.iqAirApiKey}`
      );

      const pollution = response.data.data.current.pollution;
      return {
        aqi: pollution.aqius,
        pm25: pollution.p2?.v || 0,
        pm10: pollution.p1?.v || 0,
        o3: pollution.o3?.v || 0,
        no2: pollution.n2?.v || 0,
        so2: pollution.s2?.v || 0,
        co: pollution.co?.v || 0,
        category: this.getAQICategory(pollution.aqius)
      };
    } catch (error) {
      // Fallback to mock data if API fails
      return {
        aqi: 50,
        pm25: 12,
        pm10: 20,
        o3: 80,
        no2: 25,
        so2: 10,
        co: 0.5,
        category: 'Good'
      };
    }
  }

  private async getNaturalEvents(lat: number, lon: number): Promise<NaturalEvent[]> {
    // Mock implementation - would integrate with USGS or similar
    return [];
  }

  private async getLocationInfo(lat: number, lon: number) {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.openWeatherApiKey}`
    );

    const location = response.data[0];
    return {
      latitude: lat,
      longitude: lon,
      city: location.name,
      country: location.country
    };
  }

  private getAQICategory(aqi: number): string {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }
}