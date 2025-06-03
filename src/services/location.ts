import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockLocations } from '../data/mockData';

export interface Location {
  id: string;
  city: string;
  state: string;
  temperature?: number;
  lastUpdate?: string;
  condition?: string;
  isFavorite?: boolean;
}

const STORAGE_KEY = '@WeatherApp:locations';

// Mock data for cities
// Função para normalizar strings (remover acentos e converter para minúsculas)
const normalizeString = (str: string) => {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

// Convert mock data to Location array
const mockCities: Location[] = Object.values(mockLocations).map((data, index) => ({
  id: String(index + 1),
  city: data.city,
  state: data.state,
  temperature: data.weather.temperature,
  condition: data.weather.condition
}));

export const locationService = {
  async getLocations(): Promise<Location[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting locations:', error);
      return [];
    }
  },
  async searchCities(searchTerm: string): Promise<Location[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const normalizedSearchTerm = normalizeString(searchTerm);
    return mockCities.filter(city => 
      normalizeString(city.city).includes(normalizedSearchTerm) ||
      normalizeString(city.state).includes(normalizedSearchTerm)
    );
  },

  async saveLocation(location: Omit<Location, 'id'>): Promise<Location> {
    try {
      const locations = await this.getLocations();
      const newLocation: Location = {
        ...location,
        id: Date.now().toString(),
        lastUpdate: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...locations, newLocation])
      );

      return newLocation;
    } catch (error) {
      console.error('Error saving location:', error);
      throw new Error('Failed to save location');
    }
  },

  async updateLocation(location: Location): Promise<void> {
    try {
      const locations = await this.getLocations();
      const updatedLocations = locations.map(loc => 
        loc.id === location.id ? { ...location, lastUpdate: new Date().toISOString() } : loc
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocations));
    } catch (error) {
      console.error('Error updating location:', error);
      throw new Error('Failed to update location');
    }
  },

  async deleteLocation(locationId: string): Promise<void> {
    try {
      const locations = await this.getLocations();
      const filteredLocations = locations.filter(loc => loc.id !== locationId);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredLocations));
    } catch (error) {
      console.error('Error deleting location:', error);
      throw new Error('Failed to delete location');
    }
  },

  async toggleFavorite(locationId: string): Promise<void> {
    try {
      const locations = await this.getLocations();
      const updatedLocations = locations.map(loc =>
        loc.id === locationId ? { ...loc, isFavorite: !loc.isFavorite } : loc
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocations));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw new Error('Failed to toggle favorite');
    }
  }
};
