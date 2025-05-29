import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Screens
import DashboardScreen from '../screens/DashBoardScreen';
import RegisterLocationScreen from '../screens/RegisterLocationScreen';
import AlertRecordsScreen from '../screens/AlertRecordsScreen';
import AdvicesScreen from '../screens/AdvicesScreen';
import CommunityScreen from '../screens/CommunityScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="DashBoard" component={DashboardScreen} />
        <Stack.Screen name="RegisterLocation" component={RegisterLocationScreen} />
        <Stack.Screen
          name="AlertRecords"
          component={AlertRecordsScreen}
          options={{ title: 'Histórico de Alertas' }}
        />
        <Stack.Screen
          name="Advices"
          component={AdvicesScreen}
          options={{ title: 'Página de Conselhos' }}
        />
        <Stack.Screen
          name="Community"
          component={CommunityScreen}
          options={{ title: 'Feed da comunidade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}