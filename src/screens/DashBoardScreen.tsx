import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import Header from '../components/Header';
import theme from '../styles/theme';
import { RootStackParamList } from '../types/navigation';
import { mockLocations } from '../data/mockData';

const { width, height } = Dimensions.get('window');

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DashBoard'>;
  alertMessage?: string;
  onAlertPress?: () => void;
};

type DashboardScreenRouteProp = RouteProp<RootStackParamList, 'DashBoard'>;

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  navigation,
  alertMessage = "Ver recomendações ➔",
  onAlertPress
}) => {
  const route = useRoute<DashboardScreenRouteProp>();
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState(mockLocations['São Paulo-SP']);

  const [currentWeather, setCurrentWeather] = useState({
    city: locationData.city,
    state: locationData.state,
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    temperature: locationData.weather.temperature,
    condition: locationData.weather.condition,
  });

  const [riskMetrics] = useState({
    floodRisk: 'Alto',
    rainLevel: '120mm',
    soilSaturation: '85%',
    lastUpdate: '2 horas atrás'
  });

  useEffect(() => {
    const loadSavedLocation = async () => {
      try {
        const savedLocation = await AsyncStorage.getItem('@saved_location');
        if (savedLocation) {
          const locationData = JSON.parse(savedLocation);
          const key = `${locationData.city}-${locationData.state}`;
          const mockData = mockLocations[key] || mockLocations['São Paulo-SP'];

          setLocationData(mockData);
          setCurrentWeather({
            city: mockData.city,
            state: mockData.state,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            temperature: mockData.weather.temperature,
            condition: mockData.weather.condition,
          });
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

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('chuva forte') || conditionLower.includes('tempestade')) {
      return 'thunderstorm-outline';
    }
    if (conditionLower.includes('chuva')) {
      return 'rainy-outline';
    }
    if (conditionLower.includes('nublado')) {
      return 'cloudy-outline';
    }
    if (conditionLower.includes('parcialmente')) {
      return 'partly-sunny-outline';
    }
    return 'sunny-outline';
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'baixo':
        return theme.colors.success;
      case 'médio':
        return theme.colors.warning;
      case 'alto':
        return theme.colors.error;
      case 'crítico':
        return '#DC2626'; // Vermelho mais intenso para situações críticas
      default:
        return theme.colors.primary;
    }
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

        <WeatherCard>
          <WeatherHeader>
            <WeatherInfo>
              <WeatherTemp>{locationData.weather.temperature}°</WeatherTemp>
              <WeatherDesc>{locationData.weather.condition}</WeatherDesc>
            </WeatherInfo>
            <WeatherIcon>
              <Ionicons
                name={getWeatherIcon(locationData.weather.condition)}
                size={48}
                color={theme.colors.primary}
              />
            </WeatherIcon>
          </WeatherHeader>
          <WeatherMetrics>
            <MetricItem>
              <Ionicons name="water-outline" size={20} color={theme.colors.primary} />
              <MetricText>Chuva: {locationData.risks.rainLevel}</MetricText>
            </MetricItem>
            <MetricItem>
              <Ionicons name="warning-outline" size={20} color={getRiskColor(locationData.risks.floodRisk)} />
              <MetricText>Risco de Enchente: {locationData.risks.floodRisk}</MetricText>
            </MetricItem>
          </WeatherMetrics>
        </WeatherCard>

        <RiskSection>
          <SectionTitle>ÍNDICES DE RISCO</SectionTitle>
          <RiskGrid>
            <RiskCard danger={locationData.risks.soilSaturation > '80%'}>
              <RiskIcon>
                <Ionicons name="water" size={24} color="#fff" />
              </RiskIcon>
              <RiskInfo>
                <RiskLabel>Saturação do Solo</RiskLabel>
                <RiskValue>{locationData.risks.soilSaturation}</RiskValue>
              </RiskInfo>
            </RiskCard>

            <RiskCard warning={locationData.risks.riskAreas > 3}>
              <RiskIcon>
                <Ionicons name="alert-circle" size={24} color="#fff" />
              </RiskIcon>
              <RiskInfo>
                <RiskLabel>Áreas de Risco Próximas</RiskLabel>
                <RiskValue>{locationData.risks.riskAreas}</RiskValue>
              </RiskInfo>
            </RiskCard>
          </RiskGrid>
          <LastUpdate>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</LastUpdate>
        </RiskSection>

        <ActionSection>
          <SectionTitle>AÇÕES RÁPIDAS</SectionTitle>
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
        </ActionSection>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: width * 0.05,
  },
  historyButton: {
    marginRight: 12,
    padding: 10,
    borderRadius: 12,
    backgroundColor: theme.colors.card,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  }
});

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const LocationHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background-color: ${theme.colors.card};
  padding: 15px;
  border-radius: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 2px;
`;

const CityContainer = styled.View`
  flex: 1;
`;

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
  font-size: 18px;
  color: ${theme.colors.text};
  font-weight: 500;
`;

const WeatherCard = styled.View`
  background-color: ${theme.colors.card};
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const WeatherHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const WeatherInfo = styled.View`
  flex: 1;
`;

const WeatherTemp = styled.Text`
  font-size: 48px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

const WeatherDesc = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  opacity: 0.7;
`;

const WeatherIcon = styled.View`
  padding: 10px;
`;

const WeatherMetrics = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-top: 15px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
`;

const MetricItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const MetricText = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
`;

const RiskSection = styled.View`
  margin-bottom: 20px;
`;

const ActionSection = styled.View`
  background-color: ${theme.colors.card};
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 15px;
  letter-spacing: 0.5px;
`;

const RiskGrid = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
`;

interface RiskCardProps {
  danger?: boolean;
  warning?: boolean;
}

const RiskCard = styled.View<RiskCardProps>`
  background-color: ${(props: RiskCardProps) =>
    props.danger ? theme.colors.error :
      props.warning ? theme.colors.warning :
        theme.colors.primary};
  border-radius: 12px;
  padding: 15px;
  flex: 1;
  flex-direction: row;
  align-items: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.20;
  shadow-radius: 2.84px;
`;

const RiskIcon = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const RiskInfo = styled.View`
  flex: 1;
`;

const RiskLabel = styled.Text`
  color: #fff;
  font-size: 12px;
  opacity: 0.9;
`;

const RiskValue = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  margin-top: 4px;
`;

const LastUpdate = styled.Text`
  color: ${theme.colors.text};
  font-size: 12px;
  opacity: 0.7;
  text-align: right;
`;

const ButtonsContainer = styled.View`
  gap: 12px;
`;

const AlertButtonWrapper = styled.TouchableOpacity`
  width: 100%;
`;

const ButtonContent = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
`;

const ButtonText = styled.Text`
  color: ${theme.colors.primary};
  font-size: 16px;
  font-weight: 600;
  flex: 1;
  margin-left: 12px;
`;

const EmergencyButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  flex: 1;
  margin-left: 12px;
`;

const EmergencyButton = styled.View`
  background-color: ${theme.colors.error};
  border-radius: 12px;
  elevation: 3;
  shadow-color: ${theme.colors.error};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 3.84px;
`;

const AlertButton = styled.View`
  background-color: ${theme.colors.background};
  border-radius: 12px;
  border: 1.5px solid ${theme.colors.primary};
`;

export default DashboardScreen;