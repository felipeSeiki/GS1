import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, StyleSheet, Platform, TouchableOpacity, View, Dimensions, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { DisasterAlert, AlertType, AlertSeverity, getSeverityColor, getAlertTypeLabel } from '../types/alerts';
import { Theme } from '../styles/theme';
import { locationService, Location } from '../services/location';
import Header from '../components/Header';
import theme from '../styles/theme';

const { width } = Dimensions.get('window');

type AlertRecordsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AlertRecords'>;
};

// Mock data for testing
const mockAlerts: DisasterAlert[] = [
  {
    id: '1',
    title: 'Alerta de Tempestade',
    type: 'STORM',
    severity: 'HIGH',
    status: 'ACTIVE',
    startDate: '2025-06-02T10:00:00',
    description: 'Tempestade severa prevista com possibilidade de alagamentos.',
    location: {
      city: 'São Paulo',
      state: 'SP',
      coordinates: {
        latitude: -23.550520,
        longitude: -46.633308
      }
    },
    affectedAreas: ['Zona Sul', 'Centro'],
    recommendations: [
      'Evite áreas alagadas',
      'Fique em local seguro',
      'Mantenha-se informado'
    ],
    emergencyContacts: {
      civilDefense: '199',
      firefighters: '193'
    }
  },
  {
    id: '2',
    title: 'Alerta de Calor Intenso',
    type: 'TEMPERATURE',
    severity: 'MEDIUM',
    status: 'ACTIVE',
    startDate: '2025-06-01T08:00:00',
    description: 'Temperatura acima de 35°C prevista.',
    location: {
      city: 'Rio de Janeiro',
      state: 'RJ',
      coordinates: {
        latitude: -22.906847,
        longitude: -43.172897
      }
    },
    affectedAreas: ['Toda a cidade'],
    recommendations: [
      'Beba água frequentemente',
      'Evite exposição ao sol',
      'Use protetor solar'
    ],
    emergencyContacts: {
      civilDefense: '199',
      firefighters: '193'
    }
  },
  {
    id: '3',
    title: 'Alerta de Alagamento',
    type: 'FLOOD',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    startDate: '2025-06-02T15:00:00',
    description: 'Fortes chuvas causaram alagamentos em diversas regiões.',
    location: {
      city: 'São Paulo',
      state: 'SP',
      coordinates: {
        latitude: -23.550520,
        longitude: -46.633308
      }
    },
    affectedAreas: ['Zona Leste', 'Marginal Tietê'],
    recommendations: [
      'Evite transitar em áreas alagadas',
      'Busque rotas alternativas',
      'Aguarde orientações das autoridades'
    ],
    emergencyContacts: {
      civilDefense: '199',
      firefighters: '193'
    }
  },
  {
    id: '4',
    title: 'Alerta de Ventos Fortes',
    type: 'WIND',
    severity: 'HIGH',
    status: 'ACTIVE',
    startDate: '2025-06-02T14:30:00',
    description: 'Rajadas de vento podem ultrapassar 80 km/h.',
    location: {
      city: 'Curitiba',
      state: 'PR',
      coordinates: {
        latitude: -25.428954,
        longitude: -49.271232
      }
    },
    affectedAreas: ['Região Metropolitana'],
    recommendations: [
      'Evite áreas com estruturas instáveis',
      'Recolha objetos soltos',
      'Fique atento a quedas de árvores'
    ],
    emergencyContacts: {
      civilDefense: '199',
      firefighters: '193'
    }
  },
  {
    id: '5',
    title: 'Alerta de Radiação UV',
    type: 'UV',
    severity: 'HIGH',
    status: 'ACTIVE',
    startDate: '2025-06-03T09:00:00',
    description: 'Índice de radiação UV extremamente alto.',
    location: {
      city: 'Salvador',
      state: 'BA',
      coordinates: {
        latitude: -12.977749,
        longitude: -38.501630
      }
    },
    affectedAreas: ['Orla', 'Cidade Alta'],
    recommendations: [
      'Use protetor solar FPS 50+',
      'Evite exposição entre 10h e 16h',
      'Utilize roupas com proteção UV'
    ],
    emergencyContacts: {
      civilDefense: '199',
      firefighters: '193'
    }
  }
];

const AlertRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const AlertLocationText = styled.Text`
  font-size: ${width * 0.035}px;
  color: ${({ theme }: { theme: Theme }) => theme.colors.text};
`;

const StarIcon = styled.Text`
  color: ${({ theme }: { theme: Theme }) => theme.colors.warning};
  font-size: ${width * 0.035}px;
  margin-left: ${width * 0.01}px;
`;

const AlertRecordsScreen: React.FC = () => {
  const navigation = useNavigation<AlertRecordsScreenProps['navigation']>();
  const route = useRoute<RouteProp<RootStackParamList, 'AlertRecords'>>();
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(
    route.params?.cityFilter && route.params?.stateFilter
      ? `${route.params.cityFilter}, ${route.params.stateFilter}`
      : null
  );
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);

  // Load saved locations
  useEffect(() => {
    const loadSavedLocations = async () => {
      const locations = await locationService.getLocations();
      setSavedLocations(locations);
    };
    loadSavedLocations();
  }, []);

  // Get all locations from alerts and saved locations
  const locations = useMemo(() => {
    const alertLocations = new Set(mockAlerts.map(alert =>
      `${alert.location.city}, ${alert.location.state}`
    ));

    savedLocations.forEach(location =>
      alertLocations.add(`${location.city}, ${location.state}`)
    );

    return Array.from(alertLocations);
  }, [savedLocations]);

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    let filtered = [...mockAlerts].sort((a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    if (selectedSeverity) {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity);
    }

    if (selectedLocation) {
      const [city, state] = selectedLocation.split(', ');
      filtered = filtered.filter(alert =>
        alert.location.city === city && alert.location.state === state
      );
    }

    return filtered;
  }, [selectedSeverity, selectedLocation]);

  const toggleExpand = (id: string) => {
    setExpandedAlertId(expandedAlertId === id ? null : id);
  };

  const isLocationSaved = (location: string) => {
    const [city, state] = location.split(', ');
    return savedLocations.some(
      saved => saved.city === city && saved.state === state
    );
  };

  return (
    <Container>
      <Header backTo="DashBoard" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Histórico de Alertas</Title>
        <FiltersContainer>
          <FilterSection>
            <SectionTitle>Gravidade</SectionTitle>
            <FilterRow>
              {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((severity) => (
                <SeverityChip
                  key={severity}
                  onPress={() => setSelectedSeverity(selectedSeverity === severity ? null : severity as AlertSeverity)}
                  selected={selectedSeverity === severity}
                  severity={severity as AlertSeverity}
                >
                  <FilterText selected={selectedSeverity === severity}>
                    {severity === 'LOW' ? 'Baixo' :
                      severity === 'MEDIUM' ? 'Médio' :
                        severity === 'HIGH' ? 'Alto' : 'Crítico'}
                  </FilterText>
                </SeverityChip>
              ))}
            </FilterRow>
          </FilterSection>

          <FilterSection>
            <SectionTitle>Localidade</SectionTitle>
            <FilterRow>
              {locations.map((location) => (
                <FilterChip
                  key={location}
                  onPress={() => setSelectedLocation(selectedLocation === location ? null : location)}
                  selected={selectedLocation === location}
                >
                  <AlertRow>
                    <AlertLocationText>{location}</AlertLocationText>
                    {isLocationSaved(location) && (
                      <StarIcon>★</StarIcon>
                    )}
                  </AlertRow>
                </FilterChip>
              ))}
            </FilterRow>
          </FilterSection>
        </FiltersContainer>

        {filteredAlerts.length === 0 ? (
          <EmptyState>
            <EmptyStateText>Nenhum alerta encontrado</EmptyStateText>
          </EmptyState>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertCard key={alert.id}>
              <TouchableOpacity onPress={() => toggleExpand(alert.id)}>
                <AlertHeader>
                  <View>
                    <AlertTitle>{alert.title}</AlertTitle>
                    <AlertMeta>
                      <TypeBadge type={alert.type}>
                        <TypeText>{getAlertTypeLabel(alert.type)}</TypeText>
                      </TypeBadge>
                      <AlertRow>
                        <AlertLocationText>
                          {alert.location.city}, {alert.location.state}
                        </AlertLocationText>
                        {isLocationSaved(`${alert.location.city}, ${alert.location.state}`) && (
                          <StarIcon>★</StarIcon>
                        )}
                      </AlertRow>
                      <DateText>
                        {new Date(alert.startDate).toLocaleDateString('pt-BR')}
                      </DateText>
                    </AlertMeta>
                  </View>
                  <SeverityIndicator severity={alert.severity} />
                </AlertHeader>

                {expandedAlertId === alert.id && (
                  <AlertDetails>
                    <DetailSection>
                      <DetailTitle>Descrição:</DetailTitle>
                      <Description>{alert.description}</Description>
                    </DetailSection>

                    <DetailSection>
                      <DetailTitle>Áreas Afetadas:</DetailTitle>
                      {alert.affectedAreas.map((area, index) => (
                        <DetailText key={index}>• {area}</DetailText>
                      ))}
                    </DetailSection>

                    <DetailSection>
                      <DetailTitle>Recomendações:</DetailTitle>
                      {alert.recommendations.map((rec, index) => (
                        <DetailText key={index}>• {rec}</DetailText>
                      ))}
                    </DetailSection>

                    <DetailSection>
                      <DetailTitle>Contatos de Emergência:</DetailTitle>
                      <EmergencyContact>
                        <ContactLabel>Defesa Civil:</ContactLabel>
                        <ContactNumber>{alert.emergencyContacts.civilDefense}</ContactNumber>
                      </EmergencyContact>
                      <EmergencyContact>
                        <ContactLabel>Bombeiros:</ContactLabel>
                        <ContactNumber>{alert.emergencyContacts.firefighters}</ContactNumber>
                      </EmergencyContact>
                    </DetailSection>
                  </AlertDetails>
                )}
              </TouchableOpacity>
            </AlertCard>
          ))
        )}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: width * 0.05,
    paddingBottom: Platform.OS === 'ios' ? width * 0.1 : width * 0.05
  }
});

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.background};
`;

const Title = styled.Text`
  font-size: ${width * 0.06}px;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.colors.text};
  margin-bottom: ${width * 0.05}px;
`;

const FiltersContainer = styled.View`
  margin-bottom: ${width * 0.05}px;
`;

const FilterSection = styled.View`
  margin-bottom: ${width * 0.03}px;
`;

const FilterRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-horizontal: -${width * 0.01}px;
`;

interface StyledProps {
  selected?: boolean;
  severity?: AlertSeverity;
  type?: AlertType;
  theme: Theme;
}

const SectionTitle = styled.Text`
  font-size: ${width * 0.04}px;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.colors.text};
  margin-bottom: ${width * 0.02}px;
`;

const FilterChip = styled.TouchableOpacity<StyledProps>`
  background-color: ${(props: StyledProps) => props.selected ? props.theme.colors.primary : '#f0f0f0'};
  padding: ${width * 0.02}px ${width * 0.03}px;
  border-radius: ${width * 0.02}px;
  margin: ${width * 0.01}px;
`;

const SeverityChip = styled(FilterChip) <StyledProps>`
  background-color: ${(props: StyledProps) =>
    props.selected && props.severity
      ? getSeverityColor(props.severity)
      : '#f0f0f0'};
`;

const FilterText = styled.Text<StyledProps>`
  color: ${(props: StyledProps) => props.selected ? '#fff' : props.theme.colors.text};
  font-size: ${width * 0.035}px;
`;

const AlertCard = styled.View`
  background-color: #fff;
  border-radius: ${width * 0.03}px;
  padding: ${width * 0.04}px;
  margin-bottom: ${width * 0.03}px;
  ${Platform.select({
  ios: `
      shadow-color: #000;
      shadow-offset: 0px 2px;
      shadow-opacity: 0.1;
      shadow-radius: 3px;
    `,
  android: `
      elevation: 3;
    `
})}
`;

const AlertHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const AlertTitle = styled.Text`
  font-size: ${width * 0.045}px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: ${width * 0.02}px;
`;

const AlertMeta = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TypeBadge = styled.View<StyledProps>`
  background-color: #f0f0f0;
  padding: ${width * 0.01}px ${width * 0.02}px;
  border-radius: ${width * 0.01}px;
  margin-right: ${width * 0.02}px;
`;

const DateText = styled.Text`
  font-size: ${width * 0.035}px;
  color: ${theme.colors.secondary};
`;

const SeverityIndicator = styled.View<StyledProps>`
  width: ${width * 0.03}px;
  height: ${width * 0.03}px;
  border-radius: ${width * 0.015}px;
  background-color: ${(props: StyledProps) =>
    props.severity ? getSeverityColor(props.severity) : '#757575'};
`;

const AlertDetails = styled.View`
  margin-top: ${width * 0.03}px;
  padding-top: ${width * 0.03}px;
  border-top-width: 1px;
  border-top-color: #f0f0f0;
`;

const DetailSection = styled.View`
  margin-bottom: ${width * 0.03}px;
`;

const DetailTitle = styled.Text`
  font-size: ${width * 0.04}px;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.colors.text};
  margin-bottom: ${width * 0.02}px;
`;

const DetailText = styled.Text`
  font-size: ${width * 0.035}px;
  color: ${({ theme }: { theme: Theme }) => theme.colors.text};
  margin-bottom: ${width * 0.01}px;
`;

const Description = styled.Text`
  font-size: ${width * 0.035}px;
  color: ${({ theme }: { theme: Theme }) => theme.colors.text};
  line-height: ${width * 0.05}px;
`;

const EmergencyContact = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${width * 0.02}px;
`;

const ContactLabel = styled.Text`
  font-size: ${width * 0.035}px;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.colors.text};
  margin-right: ${width * 0.02}px;
`;

const ContactNumber = styled.Text`
  font-size: ${width * 0.035}px;
  color: ${({ theme }: { theme: Theme }) => theme.colors.primary};
  font-weight: bold;
`;

const TypeText = styled.Text`
  font-size: ${width * 0.035}px;
  color: ${({ theme }: { theme: Theme }) => theme.colors.text};
`;

const SavedIndicator = styled.View`
  margin-left: ${width * 0.01}px;
`;

const SavedIndicatorText = styled.Text`
  color: ${({ theme }: { theme: Theme }) => theme.colors.warning};
  font-size: ${width * 0.035}px;
`;

const EmptyState = styled.View`
  padding: ${width * 0.1}px;
  align-items: center;
  justify-content: center;
`;

const EmptyStateText = styled.Text`
  color: ${({ theme }: { theme: Theme }) => theme.colors.secondary};
  font-size: ${width * 0.04}px;
  text-align: center;
`;

const FilterContentView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const LocationRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const LocationText = styled.Text`
  font-size: 16px;
  color: ${({ theme }: { theme: Theme }) => theme.colors.text};
`;

const SavedIndicatorView = styled(SavedIndicator)`
  margin-left: 8px;
`;

const LocationBadge = styled.View`
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.card};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
`;

export default AlertRecordsScreen;