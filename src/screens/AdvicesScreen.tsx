import React from 'react';
import { ScrollView, StyleSheet, Platform, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';
import theme from '../styles/theme';

type AdviceScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Advices'>;
};

interface DisasterAlert {
  id: string;
  title: string;
  description: string;
  recommendations: string[];
  emergencyContacts: {
    civilDefense: string;
    firefighters: string;
  };
}

// Mock data for testing
const mockAlert: DisasterAlert = {
  id: '1',
  title: 'Desastre',
  description: 'Descrição detalhada do desastre natural ou evento climático que está ocorrendo na região. Inclui informações sobre a gravidade e área afetada.',
  recommendations: [
    'Mantenha-se em local seguro',
    'Siga as orientações das autoridades',
    'Prepare um kit de emergência'
  ],
  emergencyContacts: {
    civilDefense: '199',
    firefighters: '193'
  }
};

const { width, height } = Dimensions.get('window');

const AdviceScreen: React.FC = () => {
  const navigation = useNavigation<AdviceScreenProps['navigation']>();

  return (
    <Container>
      <Header backTo="DashBoard" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AlertCard>
          <Title>{mockAlert.title}</Title>

          <Section>
            <SectionTitle>Descrição:</SectionTitle>
            <Description>{mockAlert.description}</Description>
          </Section>

          <Section>
            <SectionTitle>Recomendações do que fazer:</SectionTitle>
            {mockAlert.recommendations.map((recommendation, index) => (
              <RecommendationText key={index}>• {recommendation}</RecommendationText>
            ))}
          </Section>

          <Section>
          </Section>

          <Section>
            <SectionTitle>Ligue em caso de emergência:</SectionTitle>
            <EmergencyContact>
              <ContactLabel>Defesa Civil:</ContactLabel>
              <ContactNumber>{mockAlert.emergencyContacts.civilDefense}</ContactNumber>
            </EmergencyContact>
            <EmergencyContact>
              <ContactLabel>Bombeiros:</ContactLabel>
              <ContactNumber>{mockAlert.emergencyContacts.firefighters}</ContactNumber>
            </EmergencyContact>
          </Section>
        </AlertCard>
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

const AlertCard = styled.View`
  background-color: #E8E8E8;
  border-radius: ${width * 0.03}px;
  padding: ${width * 0.05}px;
  margin-bottom: ${height * 0.02}px;
  margin-horizontal: ${width * 0.03}px;
`;

const Title = styled.Text`
  font-size: ${width * 0.06}px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: ${height * 0.03}px;
  text-align: left;
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
  background-color: #FFFFFF;
  padding: ${width * 0.03}px ${width * 0.04}px;
  border-radius: ${width * 0.02}px;
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