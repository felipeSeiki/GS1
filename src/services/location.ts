import AsyncStorage from '@react-native-async-storage/async-storage';

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
const mockCities: Location[] = [
  { id: '1', city: 'São Paulo', state: 'SP', temperature: 22 },
  { id: '2', city: 'Rio de Janeiro', state: 'RJ', temperature: 28 },
  { id: '3', city: 'Curitiba', state: 'PR', temperature: 18 },
  { id: '4', city: 'Salvador', state: 'BA', temperature: 30 },
  { id: '5', city: 'Belo Horizonte', state: 'MG', temperature: 25 },
];

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
    // Filtrar cidades mockadas pelo termo de busca
    return mockCities.filter(city => 
      city.city.toLowerCase().includes(searchTerm.toLowerCase())
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
