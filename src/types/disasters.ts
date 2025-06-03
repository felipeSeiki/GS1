export type RiskLevel = 'Baixo' | 'Médio' | 'Alto' | 'Crítico' | 'Nenhum';
export type DisasterType = 'Enchente' | 'Deslizamento' | 'Seca' | 'Incêndio' | 'Vendaval' | 'Nenhum';

export interface DisasterRisk {
  type: DisasterType;
  level: RiskLevel;
  details: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  rainProbability: number;
}

export interface RiskData {
  currentRisks: DisasterRisk[];
  rainLevel: string;
  soilSaturation: string;
  riskAreas: number;
}

export interface LocationData {
  city: string;
  state: string;
  weather: WeatherData;
  activeDisasters: DisasterType[];
  risks: RiskData;
  recommendations: string[];
}
