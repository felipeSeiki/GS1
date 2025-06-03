export type RiskLevel = 'Baixo' | 'Médio' | 'Alto' | 'Crítico' | 'Nenhum';
export type DisasterType = 'Enchente' | 'Deslizamento' | 'Seca' | 'Incêndio' | 'Vendaval' | 'Nenhum';

export interface DisasterRisk {
  type: DisasterType;
  level: RiskLevel;
  details: string;
}

export interface LocationData {
  city: string;
  state: string;
  weather: {
    temperature: number;
    condition: string;
    humidity: number;
    rainProbability: number;
  };
  activeDisasters: DisasterType[];
  risks: {
    currentRisks: DisasterRisk[];
    rainLevel: string;
    soilSaturation: string;
    riskAreas: number;
  };
  recommendations: string[];
}

export const mockLocations: { [key: string]: LocationData } = {
  'São Paulo-SP': {
    city: 'São Paulo',
    state: 'SP',
    weather: {
      temperature: 20,
      condition: 'Nublado',
      humidity: 85,
      rainProbability: 80
    },
    activeDisasters: ['Enchente', 'Deslizamento'],
    risks: {
      currentRisks: [
        {
          type: 'Enchente',
          level: 'Alto',
          details: 'Risco de alagamentos em áreas urbanas devido à chuva intensa'
        },
        {
          type: 'Deslizamento',
          level: 'Médio',
          details: 'Possibilidade de deslizamentos em áreas de encosta'
        }
      ],
      rainLevel: '120mm',
      soilSaturation: '85%',
      riskAreas: 3
    },
    recommendations: [
      'Evite áreas sujeitas a alagamentos',
      'Fique atento aos alertas da Defesa Civil',
      'Não atravesse ruas alagadas',
      'Mantenha-se em local seguro durante tempestades'
    ]
  },
  'Rio de Janeiro-RJ': {
    city: 'Rio de Janeiro',
    state: 'RJ',
    weather: {
      temperature: 28,
      condition: 'Parcialmente Nublado',
      humidity: 70,
      rainProbability: 20
    },
    activeDisasters: ['Deslizamento'],
    risks: {
      currentRisks: [
        {
          type: 'Deslizamento',
          level: 'Alto',
          details: 'Risco de deslizamentos em áreas de encosta devido às chuvas recentes'
        }
      ],
      rainLevel: '45mm',
      soilSaturation: '75%',
      riskAreas: 5
    },
    recommendations: [
      'Evite áreas próximas a encostas',
      'Fique atento aos alertas da Defesa Civil',
      'Mantenha-se informado sobre as condições meteorológicas',
      'Em caso de chuva forte, procure abrigo seguro'
    ]
  },
  'Manaus-AM': {
    city: 'Manaus',
    state: 'AM',
    weather: {
      temperature: 32,
      condition: 'Chuva Forte',
      humidity: 90,
      rainProbability: 95
    },
    activeDisasters: ['Enchente'],
    risks: {
      currentRisks: [
        {
          type: 'Enchente',
          level: 'Crítico',
          details: 'Risco de transbordamento dos rios'
        }
      ],
      rainLevel: '180mm',
      soilSaturation: '95%',
      riskAreas: 4
    },
    recommendations: [
      'Evite áreas ribeirinhas',
      'Prepare-se para possível evacuação',
      'Mantenha documentos em local seguro',
      'Fique atento aos níveis dos rios'
    ]
  },
  'Salvador-BA': {
    city: 'Salvador',
    state: 'BA',
    weather: {
      temperature: 30,
      condition: 'Ensolarado',
      humidity: 45,
      rainProbability: 10
    },
    activeDisasters: ['Nenhum'],
    risks: {
      currentRisks: [
        {
          type: 'Nenhum',
          level: 'Baixo',
          details: 'Sem riscos significativos no momento'
        }
      ],
      rainLevel: '20mm',
      soilSaturation: '45%',
      riskAreas: 2
    },
    recommendations: [
      'Mantenha-se hidratado',
      'Evite exposição prolongada ao sol',
      'Use protetor solar',
      'Economize água'
    ]
  }
};
