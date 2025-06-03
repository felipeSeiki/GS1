import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import Header from '../components/Header';
import theme from '../styles/theme';
import { RootStackParamList } from '../types/navigation';
import { mockLocations } from '../data/mockData';
import type { DisasterType, RiskLevel } from '../types/disasters';

const { width, height } = Dimensions.get('window');

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DashBoard'>;
  alertMessage?: string;
  onAlertPress?: () => void;
};

type DashboardScreenRouteProp = RouteProp<RootStackParamList, 'DashBoard'>;

const getRiskColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'baixo':
      return theme.colors.success;
    case 'médio':
      return theme.colors.warning;
    case 'alto':
      return theme.colors.error;
    case 'crítico':
      return '#DC2626';
    default:
      return theme.colors.primary;
  }
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  alertMessage = "Ver recomendações ➔",
  onAlertPress
}) => {
  const navigation = useNavigation<DashboardScreenProps['navigation']>();
  const route = useRoute<DashboardScreenRouteProp>();
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState<typeof mockLocations['São Paulo-SP']>(mockLocations['São Paulo-SP']);

  const loadLocationData = useCallback(async (city: string, state: string) => {
    try {
      const key = `${city}-${state}`;
      const mockData = mockLocations[key];

      if (!mockData) {
        Alert.alert(
          'Dados indisponíveis',
          'Não foi possível carregar os dados desta cidade. Usando dados padrão de São Paulo.',
        );
        return mockLocations['São Paulo-SP'];
      }

      return mockData;
    } catch (error) {
      console.error('Error loading location data:', error);
      return mockLocations['São Paulo-SP'];
    }
  }, []);

  const updateLocationStates = useCallback((data: typeof mockLocations['São Paulo-SP']) => {
    setLocationData(data);
  }, []);

  // Atualizar dados quando a tela receber foco
  useFocusEffect(
    useCallback(() => {
      const loadCurrentLocation = async () => {
        try {
          if (route.params?.initialLocation) {
            const { city, state } = route.params.initialLocation;
            const data = await loadLocationData(city, state);
            updateLocationStates(data);

            await AsyncStorage.setItem('@saved_location', JSON.stringify({
              city,
              state,
              temperature: data.weather.temperature,
              condition: data.weather.condition
            }));
          } else {
            const savedLocation = await AsyncStorage.getItem('@saved_location');
            if (savedLocation) {
              const { city, state } = JSON.parse(savedLocation);
              const data = await loadLocationData(city, state);
              updateLocationStates(data);
            }
          }
        } catch (error) {
          console.error('Error loading location:', error);
        }
      };

      loadCurrentLocation();
    }, [route.params?.initialLocation, loadLocationData, updateLocationStates])
  );

  const handleNavigateToAdvices = () => {
    if (onAlertPress) {
      onAlertPress();
    } else {
      navigation.navigate('Advices');
    }
  };

  const handleNavigateToHistory = () => {
    navigation.navigate('AlertRecords', {
      cityFilter: locationData.city,
      stateFilter: locationData.state
    });
  };

  const handleNavigateToEmergency = () => {
    navigation.navigate('Emergency');
  };

  const hasActiveDisasters = locationData.activeDisasters.length > 0 &&
    locationData.activeDisasters[0] !== 'Nenhum';

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

  const getDisasterIcon = (type: DisasterType) => {
    switch (type) {
      case 'Enchente':
        return 'water';
      case 'Deslizamento':
        return 'warning';
      case 'Seca':
        return 'sunny';
      case 'Incêndio':
        return 'flame';
      case 'Vendaval':
        return 'thunderstorm';
      default:
        return 'alert-circle';
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
            <CityName>{locationData.city}</CityName>
            <StateName>{locationData.state}</StateName>
          </CityContainer>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={handleNavigateToHistory}
              style={styles.historyButton}
            >
              <Ionicons name="time-outline" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <TimeText>{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</TimeText>
          </View>
        </LocationHeader>

        {hasActiveDisasters && (
          <ActiveDisastersSection>
            <SectionTitle>DESASTRES ATIVOS</SectionTitle>
            <DisasterGrid>
              {locationData.activeDisasters.map((disaster, index) => {
                const riskInfo = locationData.risks.currentRisks.find(risk => risk.type === disaster);
                return (
                  <DisasterCard key={index} level={riskInfo?.level || 'Médio'}>
                    <DisasterIcon>
                      <Ionicons name={getDisasterIcon(disaster)} size={24} color="#fff" />
                    </DisasterIcon>
                    <DisasterInfo>
                      <DisasterType>{disaster}</DisasterType>
                      <RiskLevelText>{riskInfo?.level || 'Médio'}</RiskLevelText>
                    </DisasterInfo>
                  </DisasterCard>
                );
              })}
            </DisasterGrid>
          </ActiveDisastersSection>
        )}

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
              <Ionicons name="thermometer-outline" size={20} color={theme.colors.primary} />
              <MetricText>Umidade: {locationData.weather.humidity}%</MetricText>
            </MetricItem>
          </WeatherMetrics>
        </WeatherCard>

        <RiskSection>
          <SectionTitle>ÍNDICES DE RISCO</SectionTitle>
          <RiskGrid>
            <RiskCard danger={parseInt(locationData.risks.soilSaturation) > 80}>
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

const ActiveDisastersSection = styled.View`
  margin-bottom: 20px;
`;

const DisasterGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;

interface DisasterCardProps {
  level: string;
}

const DisasterCard = styled.View<DisasterCardProps>`
  background-color: ${(props: DisasterCardProps) => getRiskColor(props.level)};
  border-radius: 12px;
  padding: 15px;
  flex-direction: row;
  align-items: center;
  width: 48%;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.20;
  shadow-radius: 2.84px;
`;

const DisasterIcon = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const DisasterInfo = styled.View`
  flex: 1;
`;

const DisasterType = styled.Text`
  color: #fff;
  font-size: 14px;
  font-weight: bold;
`;

const RiskLevelText = styled.Text`
  color: #fff;
  font-size: 12px;
  opacity: 0.9;
  margin-top: 4px;
`;

export default DashboardScreen;