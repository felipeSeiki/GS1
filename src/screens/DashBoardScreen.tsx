import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import Header from '../components/Header';
import WeatherMap from '../components/WeatherMap';
import theme from '../styles/theme';
import { RootStackParamList } from '../types/navigation';

interface DashboardScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DashBoard'>;
  alertMessage?: string;
  onAlertPress?: () => void;
}

export interface Location {
  id: string;
  city: string;
  state: string;
  temperature?: number;
  lastUpdate?: string;
  isFavorite?: boolean;
}

const { width, height } = Dimensions.get('window');

type DashboardScreenRouteProp = RouteProp<RootStackParamList, 'DashBoard'>;

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  navigation,
  alertMessage = "Ver recomendações ➔",
  onAlertPress
}) => {
  const route = useRoute<DashboardScreenRouteProp>();
  const initialLocationFromRoute = route.params?.initialLocation;
  const [loading, setLoading] = useState(false);

  const [currentWeather, setCurrentWeather] = useState({
    city: 'São Paulo',
    state: 'SP',
    time: '19h20',
    temperature: 20,
    condition: 'Nublado',
  });

  useEffect(() => {
    const loadSavedLocation = async () => {
      try {
        const savedLocation = await AsyncStorage.getItem('@saved_location');
        if (savedLocation) {
          const locationData = JSON.parse(savedLocation);
          setCurrentWeather(prev => ({
            ...prev,
            city: locationData.city,
            state: locationData.state,
            temperature: locationData.temperature || prev.temperature,
            condition: locationData.condition || prev.condition
          }));
        }
      } catch (error) {
        console.error('Error loading saved location:', error);
      }
    };

    loadSavedLocation();
  }, []);

  useEffect(() => {
    if (route.params?.initialLocation) {
      const { city, state, temperature, condition } = route.params.initialLocation;

      const saveLocation = async () => {
        try {
          await AsyncStorage.setItem('@saved_location', JSON.stringify({
            city,
            state,
            temperature,
            condition
          }));

          setCurrentWeather(prev => ({
            ...prev,
            city,
            state,
            temperature: temperature || prev.temperature,
            condition: condition || prev.condition
          }));
        } catch (error) {
          console.error('Error saving location:', error);
        }
      };

      saveLocation();
    }
  }, [route.params?.initialLocation]);

  const handleNavigateToAdvices = () => {
    if (onAlertPress) {
      onAlertPress();
    } else {
      navigation.navigate('Advices');
    }
  };

  const handleNavigateToHistory = () => {
    navigation.navigate('AlertRecords', {
      cityFilter: currentWeather.city,
      stateFilter: currentWeather.state
    });
  };

  const handleNavigateToEmergency = () => {
    navigation.navigate('Emergency');
  };

  return (
    <Container>
      <Header backTo="RegisterLocation" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LocationHeader>
          <CityContainer>
            <CityName>{currentWeather.city}</CityName>
            <StateName>{currentWeather.state}</StateName>
          </CityContainer>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={handleNavigateToHistory}
              style={styles.historyButton}
            >
              <Ionicons name="time-outline" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <TimeText>{currentWeather.time}</TimeText>
          </View>
        </LocationHeader>

        <WeatherContainer>
          <TempLabel>Temp</TempLabel>
          <Temperature>{currentWeather.temperature}°</Temperature>
          <WeatherCondition>{currentWeather.condition}</WeatherCondition>
        </WeatherContainer>

        <SectionContainer>
          <SectionTitle>ALERTA</SectionTitle>
          <ButtonsContainer>
            <AlertButtonWrapper onPress={handleNavigateToAdvices} activeOpacity={0.7}>
              <AlertButton>
                <ButtonContent>
                  <Ionicons name="alert-circle-outline" size={24} color={theme.colors.primary} />
                  <ButtonText>Ver recomendações</ButtonText>
                  <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
                </ButtonContent>
              </AlertButton>
            </AlertButtonWrapper>

            <AlertButtonWrapper onPress={handleNavigateToEmergency} activeOpacity={0.7}>
              <EmergencyButton>
                <ButtonContent>
                  <Ionicons name="warning-outline" size={24} color="#fff" />
                  <EmergencyButtonText>Emergência</EmergencyButtonText>
                  <Ionicons name="chevron-forward" size={24} color="#fff" />
                </ButtonContent>
              </EmergencyButton>
            </AlertButtonWrapper>
          </ButtonsContainer>
        </SectionContainer>

        <SectionContainer>
          <SectionTitle></SectionTitle>
        </SectionContainer>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: width * 0.05,
  },
  touchable: {
    width: '100%',
    minHeight: 44, // Altura mínima recomendada para elementos tocáveis
    padding: 10,
  },
  historyButton: {
    marginRight: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5'
  }
});

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const LocationHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const CityContainer = styled.View``;

const CityName = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

const StateName = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  opacity: 0.7;
`;

const TimeText = styled.Text`
  font-size: 20px;
  color: ${theme.colors.text};
`;

const WeatherContainer = styled.View`
  align-items: center;
  margin-bottom: 30px;
`;

const TempLabel = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
`;

const Temperature = styled.Text`
  font-size: 48px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin: 5px 0;
`;

const WeatherCondition = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  opacity: 0.7;
`;

const SectionContainer = styled.View`
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 10px;
`;

const ButtonsContainer = styled.View`
  gap: 10px;
`;

const AlertButtonWrapper = styled.TouchableOpacity`
  width: 100%;
`;

const ButtonContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
`;

const ButtonText = styled.Text`
  color: ${theme.colors.primary};
  font-size: 16px;
  flex: 1;
  margin-left: 10px;
`;

const EmergencyButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  flex: 1;
  margin-left: 10px;
`;

const EmergencyButton = styled.View`
  background-color: ${theme.colors.error};
  border-radius: ${width * 0.02}px;
`;

const AlertButton = styled.View`
  background-color: ${theme.colors.background};
  border-radius: ${width * 0.02}px;
  border: 1px solid ${theme.colors.primary};
`;

export default DashboardScreen;