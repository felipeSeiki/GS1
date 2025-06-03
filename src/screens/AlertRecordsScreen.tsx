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
    title: 'Alerta de Tempestade Severa',
    type: 'STORM',
    severity: 'HIGH',
    status: 'ACTIVE',
    startDate: '2025-06-02T10:00:00',
    description: 'Tempestade severa com rajadas de vento e granizo',
    location: {
      city: 'São Paulo',
      state: 'SP',
      coordinates: { latitude: -23.550520, longitude: -46.633308 }
    },
    affectedAreas: ['Zona Sul', 'Centro', 'Zona Oeste'],
    recommendations: [
      'Evite áreas alagadas',
      'Procure abrigo em local seguro',
      'Mantenha distância de árvores e postes',
      'Desligue aparelhos elétricos em caso de raios'
    ],
    emergencyContacts: { civilDefense: '199', firefighters: '193' }
  },
  {
    id: '2',
    title: 'Alerta de Temperatura Extrema',
    type: 'TEMPERATURE',
    severity: 'HIGH',
    status: 'ACTIVE',
    startDate: '2025-06-01T08:00:00',
    description: 'Onda de calor com temperaturas acima de 35°C',
    location: {
      city: 'Rio de Janeiro',
      state: 'RJ',
      coordinates: { latitude: -22.906847, longitude: -43.172897 }
    },
    affectedAreas: ['Toda a cidade'],
    recommendations: [
      'Beba água frequentemente',
      'Evite exposição ao sol entre 10h e 16h',
      'Use protetor solar',
      'Mantenha ambientes ventilados'
    ],
    emergencyContacts: { civilDefense: '199', firefighters: '193' }
  },
  {
    id: '3',
    title: 'Alerta de Enchente',
    type: 'FLOOD',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    startDate: '2025-06-02T15:00:00',
    description: 'Transbordamento dos principais rios da região',
    location: {
      city: 'Manaus',
      state: 'AM',
      coordinates: { latitude: -3.119028, longitude: -60.021731 }
    },
    affectedAreas: ['Zona Sul', 'Zona Leste', 'Margem do Rio Negro'],
    recommendations: [
      'Evite áreas próximas aos rios',
      'Prepare-se para possível evacuação',
      'Proteja documentos importantes',
      'Monitore o nível dos rios'
    ],
    emergencyContacts: { civilDefense: '199', firefighters: '193' }
  },
  {
    id: '4',
    title: 'Alerta de Ventos Intensos',
    type: 'WIND',
    severity: 'HIGH',
    status: 'ACTIVE',
    startDate: '2025-06-02T14:30:00',
    description: 'Rajadas de vento podem ultrapassar 80 km/h',
    location: {
      city: 'Curitiba',
      state: 'PR',
      coordinates: { latitude: -25.428954, longitude: -49.271232 }
    },
    affectedAreas: ['Centro', 'Região Metropolitana'],
    recommendations: [
      'Evite áreas com estruturas instáveis',
      'Recolha objetos soltos',
      'Mantenha distância de árvores',
      'Verifique telhados e estruturas'
    ],
    emergencyContacts: { civilDefense: '199', firefighters: '193' }
  },
  {
    id: '5',
    title: 'Alerta de Radiação UV',
    type: 'UV',
    severity: 'HIGH',
    status: 'ACTIVE',
    startDate: '2025-06-03T09:00:00',
    description: 'Índice de radiação UV em níveis extremos',
    location: {
      city: 'Salvador',
      state: 'BA',
      coordinates: { latitude: -12.977749, longitude: -38.501630 }
    },
    affectedAreas: ['Orla', 'Centro', 'Região Metropolitana'],
    recommendations: [
      'Use protetor solar FPS 50+',
      'Evite exposição direta ao sol',
      'Use óculos de sol e chapéu',
      'Procure locais sombreados'
    ],
    emergencyContacts: { civilDefense: '199', firefighters: '193' }
  },
  {
    id: '6',
    title: 'Alerta de Alagamento',
    type: 'FLOOD',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    startDate: '2025-06-02T16:00:00',
    description: 'Alagamentos em diversas regiões da cidade',
    location: {
      city: 'Recife',
      state: 'PE',
      coordinates: { latitude: -8.057838, longitude: -34.882897 }
    },
    affectedAreas: ['Zona Sul', 'Centro', 'Afogados'],
    recommendations: [
      'Evite transitar em áreas alagadas',
      'Busque rotas alternativas',
      'Não force passagem em áreas alagadas',
      'Siga orientações da Defesa Civil'
    ],
    emergencyContacts: { civilDefense: '199', firefighters: '193' }
  },
  {
    id: '7',
    title: 'Alerta de Temporal',
    type: 'STORM',
    severity: 'HIGH',
    status: 'ACTIVE',
    startDate: '2025-05-15T08:00:00',
    description: 'Previsão de temporal com possibilidade de granizo',
    location: {
      city: 'Porto Alegre',
      state: 'RS',
      coordinates: { latitude: -30.033056, longitude: -51.230000 }
    },
    affectedAreas: ['Centro Histórico', 'Zona Norte', 'Zona Sul'],
    recommendations: [
      'Busque abrigo seguro',
      'Evite áreas abertas',
      'Proteja veículos do granizo',
      'Fique atento aos alertas'
    ],
    emergencyContacts: { civilDefense: '199', firefighters: '193' }
  },
  {
    id: '8',
    title: 'Alerta de Temporal Encerrado',
    type: 'STORM',
    severity: 'HIGH',
    status: 'EXPIRED',
    startDate: '2025-05-20T14:00:00',
    endDate: '2025-05-21T10:00:00',
    description: 'Temporal com rajadas de vento e chuva intensa causou diversos transtornos',
    location: {
      city: 'São Paulo',
      state: 'SP',
      coordinates: { latitude: -23.550520, longitude: -46.633308 }
    },
    affectedAreas: ['Zona Leste', 'Zona Norte', 'Centro'],
    recommendations: [
      'Aguarde a avaliação da Defesa Civil',
      'Reporte danos estruturais',
      'Evite áreas com risco de deslizamento',
      'Fique atento a novos alertas'
    ],
    emergencyContacts: { civilDefense: '199', firefighters: '193' }
  },
  {
    id: '9',
    title: 'Alerta de Alagamento Finalizado',
    type: 'FLOOD',
    severity: 'CRITICAL',
    status: 'EXPIRED',
    startDate: '2025-05-15T08:00:00',
    endDate: '2025-05-16T18:00:00',
    description: 'Graves alagamentos afetaram diversas regiões da cidade',
    location: {
      city: 'Rio de Janeiro',
      state: 'RJ',
      coordinates: { latitude: -22.906847, longitude: -43.172897 }
    },
    affectedAreas: ['Zona Sul', 'Centro', 'Barra da Tijuca'],
    recommendations: [
      'Avalie possíveis danos estruturais',
      'Documente prejuízos para seguro',
      'Higienize áreas afetadas',
      'Descarte materiais contaminados'
    ],
    emergencyContacts: { civilDefense: '199', firefighters: '193' }
  },
  {
    id: '10',
    title: 'Alerta de Temperatura Encerrado',
    type: 'TEMPERATURE',
    severity: 'HIGH',
    status: 'EXPIRED',
    startDate: '2025-05-10T09:00:00',
    endDate: '2025-05-12T20:00:00',
    description: 'Onda de calor registrou temperaturas recordes',
    location: {
      city: 'Cuiabá',
      state: 'MT',
      coordinates: { latitude: -15.601411, longitude: -56.097892 }
    },
    affectedAreas: ['Toda a cidade'],
    recommendations: [
      'Mantenha a hidratação',
      'Verifique a saúde de idosos e crianças',
      'Evite atividades físicas intensas',
      'Monitore sintomas de insolação'
    ],
    emergencyContacts: { civilDefense: '199', firefighters: '193' }
  },
  {
    id: '11',
    title: 'Alerta de Ventos Cancelado',
    type: 'WIND',
    severity: 'HIGH',
    status: 'CANCELED',
    startDate: '2025-05-05T16:00:00',
    endDate: '2025-05-05T18:00:00',
    description: 'Alerta cancelado após reavaliação meteorológica',
    location: {
      city: 'Florianópolis',
      state: 'SC',
      coordinates: { latitude: -27.594870, longitude: -48.548219 }
    },
    affectedAreas: ['Região Costeira', 'Centro'],
    recommendations: [
      'Retorne às atividades normais',
      'Mantenha-se informado',
      'Fique atento a novos alertas'
    ],
    emergencyContacts: { civilDefense: '199', firefighters: '193' }
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