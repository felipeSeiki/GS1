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
      primary: '#4A90E2',
      secondary: '#6C757D',
      background: '#F8F9FA',
      text: '#212529',
      error: '#DC3545',
      success: '#28A745',
      warning: '#FFC107',
      white: '#FFFFFF',
      border: '#DEE2E6',
      card: '#FFFFFF',
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