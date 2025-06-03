export type AlertType = 
  'STORM' | 
  'FLOOD' | 
  'TEMPERATURE' | 
  'WIND' | 
  'UV' |
  'FIRE' |
  'COASTAL' |
  'LANDSLIDE' |
  'DROUGHT';
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELED';

export interface DisasterAlert {
  id: string;
  title: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  startDate: string;
  endDate?: string;
  description: string;
  location: {
    city: string;
    state: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  affectedAreas: string[];
  recommendations: string[];
  emergencyContacts: {
    civilDefense: string;
    firefighters: string;
  };
}

export const getSeverityColor = (severity: AlertSeverity): string => {
  switch (severity) {
    case 'LOW':
      return '#4CAF50';
    case 'MEDIUM':
      return '#FFC107';
    case 'HIGH':
      return '#FF9800';
    case 'CRITICAL':
      return '#F44336';
    default:
      return '#757575';
  }
};

export const getAlertTypeLabel = (type: AlertType): string => {
  switch (type) {
    case 'STORM':
      return 'Tempestade';
    case 'FLOOD':
      return 'Alagamento';
    case 'TEMPERATURE':
      return 'Temperatura';
    case 'WIND':
      return 'Vento';
    case 'UV':
      return 'Radiação UV';
    case 'FIRE':
      return 'Incêndio';
    case 'COASTAL':
      return 'Ressaca';
    case 'LANDSLIDE':
      return 'Deslizamento';
    case 'DROUGHT':
      return 'Seca';
    default:
      return 'Outro';
  }
};
