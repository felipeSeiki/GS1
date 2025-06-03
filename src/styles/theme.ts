export interface Theme {
   colors: {
      card: any;
      primary: string;
      secondary: string;
      background: string;
      text: string;
      error: string;
      success: string;
      warning: string;
      white: string;
      border: string;
   };
   typography: {
      title: {
         fontSize: number;
         fontWeight: string;
      };
      subtitle: {
         fontSize: number;
         fontWeight: string;
      };
      body: {
         fontSize: number;
         fontWeight: string;
      };
      caption: {
         fontSize: number;
         fontWeight: string;
      };
   };
   spacing: {
      small: number;
      medium: number;
      large: number;
      xlarge: number;
   };
}

export type ThemeType = Theme;

export default {
   colors: {
      primary: '#3B82F6',
      secondary: '#6366F1',
      background: '#F8F9FA',
      text: '#1F2937',
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
      white: '#FFFFFF',
      border: '#E5E7EB',
      card: '#FFFFFF',
      surfaceLight: '#F9FAFB',
      surfaceDark: '#1F2937',
      accent: '#8B5CF6',
   },
   typography: {
      title: {
         fontSize: 24,
         fontWeight: 'bold',
      },
      subtitle: {
         fontSize: 18,
         fontWeight: '600',
      },
      body: {
         fontSize: 16,
         fontWeight: 'normal',
      },
      caption: {
         fontSize: 14,
         fontWeight: 'normal',
      },
   },
   spacing: {
      small: 8,
      medium: 16,
      large: 24,
      xlarge: 32,
   },
};