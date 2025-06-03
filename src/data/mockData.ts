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

export const getCurrentSituation = () => ({
  'São Paulo-SP': {
    city: 'São Paulo',
    state: 'SP',
    weather: {
      temperature: 19,
      condition: 'Parcialmente Nublado',
      humidity: 78,
      rainProbability: 30
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
      rainLevel: '5mm',
      soilSaturation: '60%',
      riskAreas: 3
    },
    recommendations: [
      'Mantenha-se informado sobre previsão do tempo',
      'Fique atento a mudanças climáticas',
      'Evite áreas com histórico de alagamento'
    ]
  },
  'Rio de Janeiro-RJ': {
    city: 'Rio de Janeiro',
    state: 'RJ',
    weather: {
      temperature: 25,
      condition: 'Ensolarado',
      humidity: 65,
      rainProbability: 10
    },
    activeDisasters: ['Nenhum'],
    risks: {
      currentRisks: [
        {
          type: 'Deslizamento',
          level: 'Médio',
          details: 'Risco moderado em áreas de encosta devido a chuvas recentes'
        }
      ],
      rainLevel: '0mm',
      soilSaturation: '70%',
      riskAreas: 4
    },
    recommendations: [
      'Monitore encostas em sua região',
      'Observe sinais de movimentação do solo',
      'Mantenha contatos de emergência acessíveis'
    ]
  },
  'Manaus-AM': {
    city: 'Manaus',
    state: 'AM',
    weather: {
      temperature: 31,
      condition: 'Chuva Leve',
      humidity: 85,
      rainProbability: 70
    },
    activeDisasters: ['Enchente'],
    risks: {
      currentRisks: [
        {
          type: 'Enchente',
          level: 'Alto',
          details: 'Nível do Rio Negro próximo à cota de alerta'
        }
      ],
      rainLevel: '45mm',
      soilSaturation: '88%',
      riskAreas: 5
    },
    recommendations: [
      'Monitore o nível do rio',
      'Prepare kit de emergência',
      'Mantenha documentos em local seguro'
    ]
  },
  'Curitiba-PR': {
    city: 'Curitiba',
    state: 'PR',
    weather: {
      temperature: 15,
      condition: 'Nublado',
      humidity: 82,
      rainProbability: 40
    },
    activeDisasters: ['Nenhum'],
    risks: {
      currentRisks: [
        {
          type: 'Nenhum',
          level: 'Baixo',
          details: 'Condições estáveis no momento'
        }
      ],
      rainLevel: '2mm',
      soilSaturation: '55%',
      riskAreas: 2
    },
    recommendations: [
      'Mantenha-se agasalhado',
      'Fique atento à previsão do tempo',
      'Evite exposição prolongada ao frio'
    ]
  },
  'Salvador-BA': {
    city: 'Salvador',
    state: 'BA',
    weather: {
      temperature: 28,
      condition: 'Ensolarado',
      humidity: 75,
      rainProbability: 5
    },
    activeDisasters: ['Nenhum'],
    risks: {
      currentRisks: [
        {
          type: 'Costeiro',
          level: 'Médio',
          details: 'Possibilidade de ressaca marítima'
        }
      ],
      rainLevel: '0mm',
      soilSaturation: '40%',
      riskAreas: 3
    },
    recommendations: [
      'Evite banho de mar em áreas sinalizadas',
      'Atenção às bandeiras dos guarda-vidas',
      'Use protetor solar'
    ]
  },
  'Recife-PE': {
    city: 'Recife',
    state: 'PE',
    weather: {
      temperature: 27,
      condition: 'Chuva Moderada',
      humidity: 80,
      rainProbability: 75
    },
    activeDisasters: ['Alagamento'],
    risks: {
      currentRisks: [
        {
          type: 'Alagamento',
          level: 'Alto',
          details: 'Diversas áreas da cidade com pontos de alagamento'
        }
      ],
      rainLevel: '35mm',
      soilSaturation: '82%',
      riskAreas: 6
    },
    recommendations: [
      'Evite áreas alagadas',
      'Use rotas alternativas',
      'Fique atento aos alertas da Defesa Civil'
    ]
  },
  'Florianópolis-SC': {
    city: 'Florianópolis',
    state: 'SC',
    weather: {
      temperature: 18,
      condition: 'Ventando',
      humidity: 70,
      rainProbability: 20
    },
    activeDisasters: ['Vendaval'],
    risks: {
      currentRisks: [
        {
          type: 'Vendaval',
          level: 'Alto',
          details: 'Rajadas de vento acima de 80km/h'
        }
      ],
      rainLevel: '0mm',
      soilSaturation: '45%',
      riskAreas: 3
    },
    recommendations: [
      'Evite áreas costeiras',
      'Recolha objetos soltos',
      'Mantenha-se informado sobre condições do tempo'
    ]
  },
  'Brasília-DF': {
    city: 'Brasília',
    state: 'DF',
    weather: {
      temperature: 26,
      condition: 'Ensolarado',
      humidity: 30,
      rainProbability: 0
    },
    activeDisasters: ['Incêndio'],
    risks: {
      currentRisks: [
        {
          type: 'Incêndio',
          level: 'Alto',
          details: 'Alto risco de incêndios devido à baixa umidade'
        }
      ],
      rainLevel: '0mm',
      soilSaturation: '20%',
      riskAreas: 4
    },
    recommendations: [
      'Mantenha-se hidratado',
      'Evite queimadas',
      'Reporte focos de incêndio'
    ]
  }
});
