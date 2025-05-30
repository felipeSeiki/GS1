import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';
import WeatherMap from '../components/WeatherMap';
import theme from '../styles/theme';
import { RootStackParamList } from '../types/navigation';

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DashBoard'>;
};

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardScreenProps['navigation']>();
  const [currentWeather] = useState({
    city: 'São Paulo',
    state: 'São Paulo',
    time: '19h20',
    temperature: 20,
    condition: 'Nublado',
  });

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
          <TimeText>{currentWeather.time}</TimeText>
        </LocationHeader>

        <WeatherContainer>
          <TempLabel>Temp</TempLabel>
          <Temperature>{currentWeather.temperature}°</Temperature>
          <WeatherCondition>{currentWeather.condition}</WeatherCondition>
        </WeatherContainer>

        <SectionContainer>
          <SectionTitle>ALERTA</SectionTitle>
          <TouchableOpacity onPress={() => navigation.navigate('AlertRecords')}>
            <SeeMoreText>Ver recomendações ➔</SeeMoreText>
          </TouchableOpacity>
        </SectionContainer>

        <SectionContainer>
          <SectionTitle>MAPA</SectionTitle>
          <WeatherMap
            temperature={currentWeather.temperature}
            city={currentWeather.city}
            state={currentWeather.state}
          />
        </SectionContainer>
      </ScrollView>
    </Container>
  );
};

const styles = {
  scrollContent: {
    padding: 20,
  },
};

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

const SeeMoreText = styled.Text`
  color: ${theme.colors.primary};
  font-size: 14px;
  text-align: right;
`;

export default DashboardScreen;