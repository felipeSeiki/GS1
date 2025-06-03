interface LocationData {
  city: string;
  state: string;
  weather: {
    temperature: number;
    condition: string;
  };
  risks: {
    floodRisk: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
    rainLevel: string;
    soilSaturation: string;
    riskAreas: number;
    riskLevel: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  };
}

export const mockLocations: { [key: string]: LocationData } = {
  'São Paulo-SP': {
    city: 'São Paulo',
    state: 'SP',
    weather: {
      temperature: 20,
      condition: 'Nublado',
    },
    risks: {
      floodRisk: 'Alto',
      rainLevel: '120mm',
      soilSaturation: '85%',
      riskAreas: 3,
      riskLevel: 'Alto',
    },
  },
  'Rio de Janeiro-RJ': {
    city: 'Rio de Janeiro',
    state: 'RJ',
    weather: {
      temperature: 28,
      condition: 'Parcialmente Nublado',
    },
    risks: {
      floodRisk: 'Médio',
      rainLevel: '80mm',
      soilSaturation: '70%',
      riskAreas: 5,
      riskLevel: 'Alto',
    },
  },
  'Petrópolis-RJ': {
    city: 'Petrópolis',
    state: 'RJ',
    weather: {
      temperature: 18,
      condition: 'Chuva Forte',
    },
    risks: {
      floodRisk: 'Crítico',
      rainLevel: '150mm',
      soilSaturation: '92%',
      riskAreas: 8,
      riskLevel: 'Crítico',
    },
  },
  'Santos-SP': {
    city: 'Santos',
    state: 'SP',
    weather: {
      temperature: 24,
      condition: 'Chuva Leve',
    },
    risks: {
      floodRisk: 'Alto',
      rainLevel: '95mm',
      soilSaturation: '78%',
      riskAreas: 4,
      riskLevel: 'Alto',
    },
  },
  'Blumenau-SC': {
    city: 'Blumenau',
    state: 'SC',
    weather: {
      temperature: 22,
      condition: 'Tempestade',
    },
    risks: {
      floodRisk: 'Crítico',
      rainLevel: '180mm',
      soilSaturation: '95%',
      riskAreas: 6,
      riskLevel: 'Crítico',
    },
  },
  'Recife-PE': {
    city: 'Recife',
    state: 'PE',
    weather: {
      temperature: 29,
      condition: 'Chuva Moderada',
    },
    risks: {
      floodRisk: 'Alto',
      rainLevel: '110mm',
      soilSaturation: '82%',
      riskAreas: 4,
      riskLevel: 'Alto',
    },
  },
  'Salvador-BA': {
    city: 'Salvador',
    state: 'BA',
    weather: {
      temperature: 30,
      condition: 'Ensolarado',
    },
    risks: {
      floodRisk: 'Baixo',
      rainLevel: '20mm',
      soilSaturation: '45%',
      riskAreas: 2,
      riskLevel: 'Baixo',
    },
  },
  'Manaus-AM': {
    city: 'Manaus',
    state: 'AM',
    weather: {
      temperature: 32,
      condition: 'Chuva Forte',
    },
    risks: {
      floodRisk: 'Alto',
      rainLevel: '130mm',
      soilSaturation: '88%',
      riskAreas: 5,
      riskLevel: 'Alto',
    },
  }
};
