/**
 * Tipos relacionados à navegação
 * Este arquivo contém todas as definições de tipos necessárias para a navegação entre telas
 */

/**
 * Define as rotas disponíveis na aplicação e seus parâmetros
 * @property DashBoard - Tela de principal do aplicativo
 * @property RegisterLocation - Tela de registro de localização
 * @property AlertRecors - Tela histórica de alertas
 * @property Advices - Tela de conselhos e dicas
 * @property Community - Tela da comunidade
 */
import { Location } from '../services/location';

export type RootStackParamList = {
  RegisterLocation: undefined;
  DashBoard: {
    initialLocation?: {
      city: string;
      state: string;
      temperature?: number;
      condition?: string;
    };
  };
  Advices: undefined;
  Emergency: undefined;
  AlertRecords: {
    cityFilter?: string;
    stateFilter?: string;
  };
};