import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, Linking, View } from 'react-native';
import { Button } from 'react-native-elements';
import styled from 'styled-components/native';
import Header from '../components/Header';
import theme from '../styles/theme';
import { RootStackParamList } from '../types/navigation';

type EmergencyScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Emergency'>;
};

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface StyledProps {
  status: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return theme.colors.success;
    case 'cancelled':
      return theme.colors.error;
    default:
      return theme.colors.warning;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmada';
    case 'cancelled':
      return 'Cancelada';
    default:
      return 'Pendente';
  }
};

const EmergencyScreen: React.FC = () => {
  const navigation = useNavigation<EmergencyScreenProps['navigation']>();
  const [loading, setLoading] = useState(true);

  const handleEmergencyCall = (number: string) => {
    Alert.alert(
      'Ligação de Emergência',
      `Você será redirecionado para fazer uma ligação para ${number}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Ligar',
          onPress: () => {
            Linking.openURL(`tel:${number}`);
          },
        },
      ],
    );
  };

  const handleShareLocation = () => {
    Alert.alert(
      'Compartilhar Localização',
      'Sua localização será compartilhada com os serviços de emergência',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Compartilhar',
          onPress: () => {
            // Aqui seria implementada a lógica de compartilhamento
            Alert.alert('Localização compartilhada com sucesso!');
          },
        },
      ],
    );
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
          <LocationText>Endereço: Av. Paulista, 1000</LocationText>
          <LocationText>São Paulo, SP</LocationText>
          <LocationText>CEP: 01310-100</LocationText>
          <ShareButton onPress={handleShareLocation}>
            <ShareButtonText>Compartilhar Localização</ShareButtonText>
          </ShareButton>
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

        <EmergencyCard>
          <EmergencyTitle>Instruções por Tipo de Emergência</EmergencyTitle>

          <EmergencyTypeContainer>
            <EmergencyTypeTitle>Enchente</EmergencyTypeTitle>
            <InstructionItem>
              <InstructionText>• Desligue energia elétrica da casa</InstructionText>
            </InstructionItem>
            <InstructionItem>
              <InstructionText>• Vá para local mais alto</InstructionText>
            </InstructionItem>
            <InstructionItem>
              <InstructionText>• Não tente atravessar água corrente</InstructionText>
            </InstructionItem>
            <InstructionItem>
              <InstructionText>• Tenha kit de emergência preparado</InstructionText>
            </InstructionItem>
          </EmergencyTypeContainer>

          <EmergencyTypeContainer>
            <EmergencyTypeTitle>Vendaval</EmergencyTypeTitle>
            <InstructionItem>
              <InstructionText>• Fique longe de janelas e portas</InstructionText>
            </InstructionItem>
            <InstructionItem>
              <InstructionText>• Procure abrigo em local resistente</InstructionText>
            </InstructionItem>
            <InstructionItem>
              <InstructionText>• Evite áreas com árvores</InstructionText>
            </InstructionItem>
            <InstructionItem>
              <InstructionText>• Não saia durante a tempestade</InstructionText>
            </InstructionItem>
          </EmergencyTypeContainer>

          <EmergencyTypeContainer>
            <EmergencyTypeTitle>Deslizamento</EmergencyTypeTitle>
            <InstructionItem>
              <InstructionText>• Saia imediatamente da área de risco</InstructionText>
            </InstructionItem>
            <InstructionItem>
              <InstructionText>• Não retorne ao local</InstructionText>
            </InstructionItem>
            <InstructionItem>
              <InstructionText>• Procure abrigo seguro</InstructionText>
            </InstructionItem>
            <InstructionItem>
              <InstructionText>• Contate autoridades</InstructionText>
            </InstructionItem>
          </EmergencyTypeContainer>
        </EmergencyCard>
      </ScrollView>
    </Container>
  );
};

const styles = {
  scrollContent: {
    padding: 20,
  },
  emergencyButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 15,
    marginTop: 10,
  },
  emergencyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    marginVertical: 5,
  },
  contactButtonText: {
    fontSize: 16,
  },
  button: {
    marginBottom: 20,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  specialty: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
  },
  dateTime: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
  },
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
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

const EmergencyText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  margin-bottom: 10px;
  line-height: 20px;
`;

const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const StatusBadge = styled.View<StyledProps>`
  background-color: ${(props: StyledProps) => getStatusColor(props.status) + '20'};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 8px;
`;

const StatusText = styled.Text<StyledProps>`
  color: ${(props: StyledProps) => getStatusColor(props.status)};
  font-size: 12px;
  font-weight: 500;
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

interface EmergencyButtonProps {
  color?: string;
}

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