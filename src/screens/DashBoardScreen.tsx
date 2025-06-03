import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
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

  const [currentWeather] = useState({
    city: initialLocationFromRoute?.city || 'São Paulo',
    state: initialLocationFromRoute?.state || 'São Paulo',
    time: '19h20',
    temperature: initialLocationFromRoute?.temperature || 20,
    condition: initialLocationFromRoute?.condition || 'Nublado',
  });

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
          <TouchableOpacity
            onPress={handleNavigateToAdvices}
            style={styles.touchable}
            activeOpacity={0.7}
          >
            <AlertButton>
              <SeeMoreText>{alertMessage}</SeeMoreText>
            </AlertButton>
          </TouchableOpacity>
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

const AlertButton = styled.View`
  padding: ${width * 0.03}px;
  background-color: ${theme.colors.background};
  border-radius: ${width * 0.02}px;
  align-items: flex-end;
`;

const SeeMoreText = styled.Text`
  color: ${theme.colors.primary};
  font-size: ${width * 0.04}px;
  text-align: right;
  padding: ${width * 0.02}px;
`;

export default DashboardScreen;