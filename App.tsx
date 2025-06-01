import { StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import theme from './src/styles/theme';
import Routes from './src/routes';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />
      <Routes />
    </ThemeProvider>
  );
}