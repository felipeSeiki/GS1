import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, Linking, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import Header from '../components/Header';
import theme from '../styles/theme';
import { RootStackParamList } from '../types/navigation';
import { LocationData, DisasterType } from '../types/disasters';
import { locationService } from '../services/location';
import AsyncStorage from '@react-native-async-storage/async-storage';

type EmergencyScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Emergency'>;
};

interface EmergencyButtonProps {
  color?: string;
}

const EmergencyScreen: React.FC = () => {
  const navigation = useNavigation<EmergencyScreenProps['navigation']>();
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocationData = async () => {
      try {
        const savedLocation = await AsyncStorage.getItem('@saved_location');
        if (savedLocation) {
          const { city, state } = JSON.parse(savedLocation);
          const data = locationService.getMockData(city, state);
          setLocationData(data);
        }
      } catch (error) {
        console.error('Error loading location data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLocationData();
  }, []);

  const handleEmergencyCall = (number: string) => {
    Alert.alert(
      'Ligação de Emergência',
      `Você será redirecionado para fazer uma ligação para ${number}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ligar', onPress: () => Linking.openURL(`tel:${number}`) },
      ],
    );
  };

  const handleShareLocation = () => {
    if (!locationData) return;

    const locationText = `
      Localização Atual:
      Cidade: ${locationData.city}
      Estado: ${locationData.state}
      Condição: ${locationData.weather.condition}
      Temperatura: ${locationData.weather.temperature}°C
      Umidade: ${locationData.weather.humidity}%
      Chuva: ${locationData.weather.rainProbability}%
      ${locationData.activeDisasters.length > 0 && locationData.activeDisasters[0] !== 'Nenhum'
        ? `\nAlertas Ativos: ${locationData.activeDisasters.join(', ')}`
        : ''}
    `;

    Alert.alert(
      'Compartilhar Localização',
      'Sua localização será compartilhada com os serviços de emergência',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Compartilhar',
          onPress: () => {
            Alert.alert('Localização compartilhada', locationText);
          },
        },
      ],
    );
  };

  // Retorna as instruções específicas para cada tipo de desastre
  const getDisasterInstructions = (type: DisasterType): string[] => {
    switch (type) {
      case 'Enchente':
        return [
          'Desligue a energia elétrica da casa',
          'Procure locais mais altos',
          'Não atravesse áreas alagadas',
          'Mantenha documentos em local seguro',
          'Fique atento aos alertas da Defesa Civil'
        ];
      case 'Deslizamento':
        return [
          'Evacue imediatamente a área de risco',
          'Não retorne ao local até autorização',
          'Monitore sinais de movimentação do solo',
          'Alerte vizinhos sobre o risco',
          'Siga as orientações da Defesa Civil'
        ];
      case 'Vendaval':
        return [
          'Mantenha-se longe de janelas',
          'Procure abrigo em local resistente',
          'Evite áreas com árvores ou postes',
          'Recolha objetos soltos',
          'Não se exponha ao vendaval'
        ];
      case 'Seca':
        return [
          'Economize água',
          'Evite atividades que consumam muita água',
          'Mantenha-se hidratado',
          'Proteja-se do sol forte',
          'Evite atividades ao ar livre nas horas mais quentes'
        ];
      case 'Incêndio':
        return [
          'Evacue o local imediatamente',
          'Não use elevadores',
          'Mantenha-se abaixado para evitar fumaça',
          'Cubra o nariz e a boca com pano úmido',
          'Não retorne ao local'
        ];
      default:
        return [];
    }
  };

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <WarningBanner>
          <WarningText>EM CASO DE EMERGÊNCIA GRAVE: Ligue imediatamente para os números abaixo ou use os botões de chamada rápida.</WarningText>
        </WarningBanner>

        <EmergencyTitle>Chamada Rápida de Emergência</EmergencyTitle>
        <EmergencyGrid>
          <EmergencyButton
            style={{ backgroundColor: '#DC3545' }}
            onPress={() => handleEmergencyCall('193')}>
            <EmergencyButtonText>Bombeiros</EmergencyButtonText>
            <EmergencyNumber>193</EmergencyNumber>
          </EmergencyButton>

          <EmergencyButton
            style={{ backgroundColor: '#0D6EFD' }}
            onPress={() => handleEmergencyCall('192')}>
            <EmergencyButtonText>SAMU</EmergencyButtonText>
            <EmergencyNumber>192</EmergencyNumber>
          </EmergencyButton>

          <EmergencyButton
            style={{ backgroundColor: '#FD7E14' }}
            onPress={() => handleEmergencyCall('199')}>
            <EmergencyButtonText>Defesa Civil</EmergencyButtonText>
            <EmergencyNumber>199</EmergencyNumber>
          </EmergencyButton>

          <EmergencyButton
            style={{ backgroundColor: '#6C757D' }}
            onPress={() => handleEmergencyCall('190')}>
            <EmergencyButtonText>Polícia Militar</EmergencyButtonText>
            <EmergencyNumber>190</EmergencyNumber>
          </EmergencyButton>
        </EmergencyGrid>

        <LocationContainer>
          <LocationTitle>Sua Localização Atual</LocationTitle>
          {locationData ? (
            <>
              <LocationText>{locationData.city}, {locationData.state}</LocationText>
              <LocationText>Temperatura: {locationData.weather.temperature}°C</LocationText>
              <LocationText>Condição: {locationData.weather.condition}</LocationText>
              {locationData.activeDisasters[0] !== 'Nenhum' && (
                <LocationAlert>Alertas ativos: {locationData.activeDisasters.join(', ')}</LocationAlert>
              )}
              <ShareButton onPress={handleShareLocation}>
                <ShareButtonText>Compartilhar Localização</ShareButtonText>
              </ShareButton>
            </>
          ) : (
            <LocationText>Carregando localização...</LocationText>
          )}
        </LocationContainer>

        <EmergencyCard>
          <EmergencyTitle>Kit de Emergência Essencial</EmergencyTitle>
          <KitItem>
            <KitItemText>• Água potável (3L/pessoa)</KitItemText>
          </KitItem>
          <KitItem>
            <KitItemText>• Lanternas e pilhas</KitItemText>
          </KitItem>
          <KitItem>
            <KitItemText>• Kit de primeiros socorros</KitItemText>
          </KitItem>
          <KitItem>
            <KitItemText>• Documentos importantes</KitItemText>
          </KitItem>
          <KitItem>
            <KitItemText>• Alimentos não perecíveis</KitItemText>
          </KitItem>
          <KitItem>
            <KitItemText>• Rádio portátil</KitItemText>
          </KitItem>
          <KitItem>
            <KitItemText>• Medicamentos essenciais</KitItemText>
          </KitItem>
          <KitItem>
            <KitItemText>• Dinheiro em espécie</KitItemText>
          </KitItem>
        </EmergencyCard>

        {locationData && locationData.activeDisasters[0] !== 'Nenhum' && (
          <EmergencyCard>
            <EmergencyTitle>Instruções para Emergências Atuais</EmergencyTitle>
            {locationData.activeDisasters.map((disaster, index) => (
              <EmergencyTypeContainer key={index}>
                <EmergencyTypeTitle>{disaster}</EmergencyTypeTitle>
                {getDisasterInstructions(disaster).map((instruction, idx) => (
                  <InstructionItem key={idx}>
                    <InstructionText>• {instruction}</InstructionText>
                  </InstructionItem>
                ))}
              </EmergencyTypeContainer>
            ))}
          </EmergencyCard>
        )}
      </ScrollView>
    </Container>
  );
};

const styles = {
  scrollContent: {
    padding: 20,
  }
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const EmergencyCard = styled.View`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const EmergencyTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 10px;
`;

const WarningBanner = styled.View`
  background-color: ${theme.colors.error};
  padding: 15px;
  margin-bottom: 20px;
`;

const WarningText = styled.Text`
  color: white;
  font-size: 14px;
`;

const EmergencyGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const EmergencyButton = styled.TouchableOpacity<EmergencyButtonProps>`
  background-color: ${(props: EmergencyButtonProps) => props.color || theme.colors.primary};
  width: 48%;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  align-items: center;
`;

const EmergencyButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
  margin-top: 8px;
`;

const EmergencyNumber = styled.Text`
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-top: 4px;
`;

const LocationContainer = styled.View`
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const LocationTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 10px;
`;

const LocationText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  margin-bottom: 5px;
`;

const LocationAlert = styled.Text`
  color: ${theme.colors.error};
  font-size: 14px;
  font-weight: bold;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const ShareButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: 12px;
  border-radius: 8px;
  margin-top: 10px;
  align-items: center;
`;

const ShareButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: bold;
`;

const KitItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 8px 0;
`;

const KitItemText = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  margin-left: 10px;
`;

const EmergencyTypeContainer = styled.View`
  margin-bottom: 20px;
`;

const EmergencyTypeTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 10px;
`;

const InstructionItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 4px 0;
`;

const InstructionText = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  margin-left: 10px;
`;

export default EmergencyScreen;