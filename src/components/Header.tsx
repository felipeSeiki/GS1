import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { AntDesign } from '@expo/vector-icons';
import theme from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type HeaderProps = {
  backTo?: keyof RootStackParamList;
};

const Header: React.FC<HeaderProps> = ({ backTo }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleBack = () => {
    if (backTo) {
      navigation.navigate(backTo as any);
    } else {
      navigation.goBack();
    }
  };

  return (
    <Container>
      {(backTo || navigation.canGoBack()) && (
        <TouchableOpacity onPress={handleBack}>
          <AntDesign name="leftcircle" size={24} color="black" />
        </TouchableOpacity>
      )}
    </Container>
  );
};

const Container = styled.View`
  background-color: ${theme.colors.background};
  padding: 16px;
  padding-top: 14px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export default Header;