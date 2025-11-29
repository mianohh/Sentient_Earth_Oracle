export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export class LocationService {
  static async getCurrentLocation(): Promise<LocationCoords> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to default location (San Francisco)
          resolve({
            latitude: 37.7749,
            longitude: -122.4194,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  static async getLocationFromCity(city: string): Promise<LocationCoords> {
    // This would typically use a geocoding service
    // For now, return some common cities
    const cityCoords: Record<string, LocationCoords> = {
      'san francisco': { latitude: 37.7749, longitude: -122.4194 },
      'new york': { latitude: 40.7128, longitude: -74.0060 },
      'london': { latitude: 51.5074, longitude: -0.1278 },
      'tokyo': { latitude: 35.6762, longitude: 139.6503 },
      'paris': { latitude: 48.8566, longitude: 2.3522 },
    };

    const normalizedCity = city.toLowerCase();
    return cityCoords[normalizedCity] || cityCoords['san francisco'];
  }
}