import React, { useState, useCallback, useEffect } from 'react';
import {
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
  StyleSheet,
  View,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import Header from '../components/Header';
import theme from '../styles/theme';
import { RootStackParamList } from '../types/navigation';
import { locationService, Location } from '../services/location';
import { TextInput } from 'react-native';

interface ButtonProps {
  disabled?: boolean;
}

type RegisterLocationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RegisterLocation'>;
};

const RegisterLocationScreen: React.FC = () => {
  const navigation = useNavigation<RegisterLocationScreenProps['navigation']>();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [searchResults, setSearchResults] = useState<Location[]>([]);

  // Load saved locations
  const loadSavedLocations = useCallback(async () => {
    try {
      const locations = await locationService.getLocations();
      setSavedLocations(locations);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as localizações salvas');
    }
  }, []);

  useEffect(() => {
    loadSavedLocations();
  }, [loadSavedLocations]);

  // Search cities with debounce
  const searchCities = useCallback(async (term: string) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results = await locationService.searchCities(term);
      setSearchResults(results);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar as cidades');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      searchCities(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, searchCities]);

  // Save location
  const handleSaveLocation = async (location: Location) => {
    setLoading(true);
    try {
      await locationService.saveLocation(location);
      await loadSavedLocations();
      setSearchTerm('');
      setSearchResults([]);
      Alert.alert('Sucesso', 'Localização salva com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a localização');
    } finally {
      setLoading(false);
    }
  };

  // Delete location
  const handleDeleteLocation = async (locationId: string) => {
    Alert.alert(
      'Deletar Localização',
      'Tem certeza que deseja deletar esta localização?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await locationService.deleteLocation(locationId);
              setSavedLocations(prev => prev.filter(loc => loc.id !== locationId));
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar a localização');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  // Navigate to Dashboard with location data
  const handleLocationPress = (location: Location) => {
    navigation.navigate('DashBoard', {
      initialLocation: {
        city: location.city,
        state: location.state,
        temperature: location.temperature,
        condition: location.condition || 'Nublado'
      }
    });
  };

  const handleInputFocus = useCallback(() => {
    // Clear results when focusing the input
    setSearchResults([]);
  }, []);

  const handleInputBlur = useCallback(() => {
    // Hide keyboard when blurring the input
    Keyboard.dismiss();
  }, []);

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Title>Buscar Cidade</Title>

          <SearchInput>
            <TextInput
              placeholder="Digite o nome da cidade"
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.input}
              placeholderTextColor={theme.colors.secondary}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              returnKeyType="search"
              autoCapitalize="words"
              autoCorrect={false}
              accessible={true}
              accessibilityLabel="Campo de busca de cidade"
              accessibilityHint="Digite o nome da cidade para buscar"
            />
          </SearchInput>

          {loading && <ActivityIndicator size="large" color={theme.colors.primary} />}

          {searchResults.length > 0 && (
            <View>
              <SectionTitle>Resultados da Busca</SectionTitle>
              {searchResults.map((result) => (
                <TouchableOpacity
                  key={result.id}
                  onPress={() => handleLocationPress(result)}
                  accessible={true}
                  accessibilityLabel={`${result.city}, ${result.state}`}
                  accessibilityHint="Toque duas vezes para ver detalhes do clima"
                >
                  <LocationCard>
                    <LocationInfo>
                      <CityName>{result.city}</CityName>
                      <StateText>{result.state}</StateText>
                      {result.temperature && (
                        <TemperatureText>{result.temperature}°C</TemperatureText>
                      )}
                    </LocationInfo>
                    <SaveButton onPress={() => handleSaveLocation(result)}>
                      <SaveButtonText>Salvar</SaveButtonText>
                    </SaveButton>
                  </LocationCard>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {savedLocations.length > 0 && (
            <View>
              <SectionTitle>Localizações Salvas</SectionTitle>
              {savedLocations.map((location) => (
                <LocationCard key={location.id}>
                  <TouchableOpacity
                    style={styles.locationButton}
                    onPress={() => handleLocationPress(location)}
                    accessible={true}
                    accessibilityLabel={`${location.city}, ${location.state}`}
                    accessibilityHint="Toque duas vezes para ver detalhes do clima"
                  >
                    <LocationInfo>
                      <CityName>{location.city}</CityName>
                      <StateText>{location.state}</StateText>
                      {location.temperature && (
                        <TemperatureText>{location.temperature}°C</TemperatureText>
                      )}
                      <LastUpdate>
                        Última atualização: {new Date(location.lastUpdate || '').toLocaleDateString()}
                      </LastUpdate>
                    </LocationInfo>
                  </TouchableOpacity>
                  <DeleteButton
                    onPress={() => handleDeleteLocation(location.id)}
                    accessible={true}
                    accessibilityLabel={`Excluir ${location.city}`}
                    accessibilityHint="Toque duas vezes para excluir esta localização"
                  >
                    <DeleteButtonText>Excluir</DeleteButtonText>
                  </DeleteButton>
                </LocationCard>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20 // Extra padding for iOS home indicator
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    minHeight: 44, // Minimum touch target size
  },
  locationButton: {
    flex: 1,
    padding: 10,
    minHeight: 44, // Minimum touch target size
  }
});

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
`;

const SearchInput = styled.View`
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-top: 20px;
  margin-bottom: 10px;
`;

const LocationCard = styled.View`
  flex-direction: row;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 10px;
  align-items: center;
  overflow: hidden;
  ${Platform.select({
  ios: `
      shadow-color: #000;
      shadow-offset: 0px 2px;
      shadow-opacity: 0.25;
      shadow-radius: 3.84px;
    `,
  android: `
      elevation: 3;
    `
})}
`;

const LocationInfo = styled.View`
  flex: 1;
  padding: 15px;
`;

const CityName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

const StateText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.secondary};
  margin-top: 4px;
`;

const TemperatureText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.primary};
  margin-top: 4px;
`;

const LastUpdate = styled.Text`
  font-size: 12px;
  color: ${theme.colors.secondary};
  margin-top: 4px;
`;

const SaveButton = styled.TouchableOpacity<ButtonProps>`
  background-color: ${theme.colors.primary};
  padding: 10px 20px;
  border-radius: 8px;
  margin: 10px;
  min-height: 44px;
  min-width: 80px;
  justify-content: center;
  align-items: center;
  opacity: ${(props: ButtonProps) => props.disabled ? 0.7 : 1};
`;

const SaveButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

const DeleteButton = styled.TouchableOpacity<ButtonProps>`
  background-color: ${theme.colors.error};
  padding: 10px 20px;
  border-radius: 8px;
  margin: 10px;
  min-height: 44px;
  min-width: 80px;
  justify-content: center;
  align-items: center;
  opacity: ${(props: ButtonProps) => props.disabled ? 0.7 : 1};
`;

const DeleteButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

export default RegisterLocationScreen;