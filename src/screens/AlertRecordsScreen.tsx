import React from 'react';
import { ScrollView, StyleSheet, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';
import theme from '../styles/theme';

type AlertRecordsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AlertRecords'>;
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

const AlertRecordsScreen: React.FC = () => {
  const navigation = useNavigation<AlertRecordsScreenProps['navigation']>();

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
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20
  }
});

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const AlertCard = styled.View`
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  ${Platform.select({
  ios: `
      shadow-color: #000;
      shadow-offset: 0px 2px;
      shadow-opacity: 0.25;
      shadow-radius: 3.84px;
    `,
  android: `
      elevation: 4;
    `
})}
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

const Section = styled.View`
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 10px;
`;

const Description = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  line-height: 24px;
`;

const RecommendationText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-bottom: 8px;
  padding-left: 10px;
`;

const EmergencyContact = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const ContactLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-right: 8px;
`;

const ContactNumber = styled.Text`
  font-size: 16px;
  color: ${theme.colors.primary};
  font-weight: bold;
`;

export default AlertRecordsScreen;