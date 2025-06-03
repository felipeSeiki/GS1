import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Platform, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';
import theme from '../styles/theme';
import { mockLocations } from '../data/mockData';
import type { LocationData } from '../data/mockData';
import type { DisasterType, RiskLevel } from '../types/disasters';

type AdviceScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Advices'>;
};

type AdviceScreenRouteProp = RouteProp<RootStackParamList, 'Advices'>;

const { width, height } = Dimensions.get('window');

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

const AdviceScreen: React.FC = () => {
  const navigation = useNavigation<AdviceScreenProps['navigation']>();
  const route = useRoute<AdviceScreenRouteProp>();
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  useEffect(() => {
    const loadSavedLocation = async () => {
      try {
        const savedLocation = await AsyncStorage.getItem('@saved_location');
        if (savedLocation) {
          const { city, state } = JSON.parse(savedLocation);
          const key = `${city}-${state}`;
          const data = mockLocations[key] || mockLocations['São Paulo-SP'];
          setLocationData(data);
        }
      } catch (error) {
        console.error('Error loading saved location:', error);
      }
    };

    loadSavedLocation();
  }, []);

  if (!locationData) {
    return null;
  }

  const hasActiveDisasters = locationData.activeDisasters.length > 0 &&
    locationData.activeDisasters[0] !== 'Nenhum';

  return (
    <Container>
      <Header backTo="DashBoard" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Recomendações de Segurança</Title>

        {hasActiveDisasters ? (
          <>
            {locationData.activeDisasters.map((disaster: DisasterType, index: number) => {
              const riskInfo = locationData.risks.currentRisks.find((risk) => risk.type === disaster);
              return (
                <AlertCard key={index} level={riskInfo?.level || 'Médio'}>
                  <DisasterHeader>
                    <DisasterTitle>{disaster}</DisasterTitle>
                    <RiskLevelBadge level={riskInfo?.level || 'Médio'}>
                      <RiskLevelText>{riskInfo?.level || 'Médio'}</RiskLevelText>
                    </RiskLevelBadge>
                  </DisasterHeader>

                  <Section>
                    <SectionTitle>Situação Atual:</SectionTitle>
                    <Description>{riskInfo?.details || 'Informações não disponíveis'}</Description>
                  </Section>

                  <Section>
                    <SectionTitle>Recomendações:</SectionTitle>
                    {locationData.recommendations.map((recommendation: string, idx: number) => (
                      <RecommendationText key={idx}>• {recommendation}</RecommendationText>
                    ))}
                  </Section>

                  <Section>
                    <SectionTitle>Contatos de Emergência:</SectionTitle>
                    <EmergencyContact>
                      <ContactLabel>Defesa Civil:</ContactLabel>
                      <ContactNumber>199</ContactNumber>
                    </EmergencyContact>
                    <EmergencyContact>
                      <ContactLabel>Bombeiros:</ContactLabel>
                      <ContactNumber>193</ContactNumber>
                    </EmergencyContact>
                  </Section>
                </AlertCard>
              );
            })}
          </>
        ) : (
          <AlertCard level="Baixo">
            <DisasterHeader>
              <DisasterTitle>Sem Riscos Ativos</DisasterTitle>
              <RiskLevelBadge level="Baixo">
                <RiskLevelText>Baixo</RiskLevelText>
              </RiskLevelBadge>
            </DisasterHeader>

            <Section>
              <Description>
                Não há desastres naturais ativos em sua região no momento.
                Mesmo assim, mantenha-se preparado e fique atento às mudanças climáticas.
              </Description>
            </Section>

            <Section>
              <SectionTitle>Recomendações Gerais:</SectionTitle>
              <RecommendationText>• Mantenha um kit de emergência em casa</RecommendationText>
              <RecommendationText>• Conheça as rotas de evacuação da sua região</RecommendationText>
              <RecommendationText>• Mantenha-se informado sobre alertas locais</RecommendationText>
              <RecommendationText>• Salve os números de emergência no seu celular</RecommendationText>
            </Section>

            <Section>
              <SectionTitle>Contatos de Emergência:</SectionTitle>
              <EmergencyContact>
                <ContactLabel>Defesa Civil:</ContactLabel>
                <ContactNumber>199</ContactNumber>
              </EmergencyContact>
              <EmergencyContact>
                <ContactLabel>Bombeiros:</ContactLabel>
                <ContactNumber>193</ContactNumber>
              </EmergencyContact>
            </Section>
          </AlertCard>
        )}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: width * 0.05,
    paddingBottom: Platform.OS === 'ios' ? height * 0.05 : height * 0.03
  }
});

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

interface RiskProps {
  level: string;
}

const AlertCard = styled.View<RiskProps>`
  background-color: ${(props: RiskProps) => getRiskColor(props.level)}20;
  border-radius: ${width * 0.03}px;
  padding: ${width * 0.05}px;
  margin-bottom: ${height * 0.02}px;
  margin-horizontal: ${width * 0.03}px;
  border: 1px solid ${(props: RiskProps) => getRiskColor(props.level)};
`;

const DisasterHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${height * 0.02}px;
`;

const DisasterTitle = styled.Text`
  font-size: ${width * 0.05}px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

const RiskLevelBadge = styled.View<RiskProps>`
  background-color: ${(props: RiskProps) => getRiskColor(props.level)};
  padding: ${width * 0.02}px ${width * 0.03}px;
  border-radius: ${width * 0.02}px;
`;

const RiskLevelText = styled.Text`
  color: #fff;
  font-size: ${width * 0.035}px;
  font-weight: bold;
`;

const Title = styled.Text`
  font-size: ${width * 0.06}px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: ${height * 0.03}px;
`;

const Section = styled.View`
  margin-bottom: ${height * 0.03}px;
`;

const SectionTitle = styled.Text`
  font-size: ${width * 0.045}px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: ${height * 0.015}px;
`;

const Description = styled.Text`
  font-size: ${width * 0.04}px;
  color: ${theme.colors.text};
  line-height: ${width * 0.06}px;
`;

const RecommendationText = styled.Text`
  font-size: ${width * 0.04}px;
  color: ${theme.colors.text};
  margin-bottom: ${height * 0.012}px;
  padding-left: ${width * 0.03}px;
`;

const EmergencyContact = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${height * 0.015}px;
`;

const ContactLabel = styled.Text`
  font-size: ${width * 0.04}px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-right: ${width * 0.02}px;
`;

const ContactNumber = styled.Text`
  font-size: ${width * 0.04}px;
  color: ${theme.colors.primary};
  font-weight: bold;
`;

export default AdviceScreen;