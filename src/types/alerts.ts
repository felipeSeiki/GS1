export type AlertType = 'RAIN' | 'WIND' | 'TEMPERATURE' | 'UV' | 'FLOOD' | 'STORM';
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
    case 'RAIN':
      return 'Chuva';
    case 'WIND':
      return 'Vento';
    case 'TEMPERATURE':
      return 'Temperatura';
    case 'UV':
      return 'Radiação UV';
    case 'FLOOD':
      return 'Alagamento';
    case 'STORM':
      return 'Tempestade';
    default:
      return 'Outro';
  }
};
