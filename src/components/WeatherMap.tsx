import React, { useState, useEffect } from 'react';
import { Platform, ActivityIndicator, View } from 'react-native';
import styled from 'styled-components/native';
import theme from '../styles/theme';

interface WeatherMapProps {
    temperature: number;
    city: string;
    state: string;
}

interface Coordinates {
    latitude: number;
    longitude: number;
}

const getTemperatureColor = (temp: number): string => {
    if (temp >= 30) return '#FF4D4D'; // Vermelho para muito quente
    if (temp >= 25) return '#FFA07A'; // Laranja para quente
    if (temp >= 20) return '#FFD700'; // Amarelo para temperatura moderada
    if (temp >= 15) return '#98FB98'; // Verde claro para temperatura agradável
    return '#87CEEB'; // Azul claro para frio
};

const WeatherMap: React.FC<WeatherMapProps> = ({ temperature, city, state }) => {
    const [loading, setLoading] = useState(true);
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const backgroundColor = getTemperatureColor(temperature);

    if (loading) {
        return (
            <MapContainer>
                <LoadingContainer>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </LoadingContainer>
            </MapContainer>
        );
    }

    if (!coordinates) {
        return (
            <MapContainer>
                <ErrorContainer>
                    <ErrorText>Não foi possível carregar o mapa</ErrorText>
                </ErrorContainer>
            </MapContainer>
        );
    }

    return (
        <MapContainer>
            <MapBackground style={{ backgroundColor }}>
            </MapBackground>
            <MapGrid>
                <GridLine horizontal />
                <GridLine />
                <LocationDot />
            </MapGrid>
        </MapContainer>
    );
};

const MapContainer = styled.View`
    width: 100%;
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    background-color: #f5f5f5;
    position: relative;
`;

const LoadingContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const ErrorContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 20px;
`;

const ErrorText = styled.Text`
    color: ${theme.colors.text};
    font-size: 14px;
`;

const MapBackground = styled.View`
    flex: 1;
    opacity: 0.15;
`;

const MapGrid = styled.View`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.1;
`;

const GridLine = styled.View<{ horizontal?: boolean }>`
    position: absolute;
    background-color: #000;
    ${(props: { horizontal?: boolean }) => props.horizontal
        ? 'height: 1px; left: 0; right: 0; top: 50%;'
        : 'width: 1px; top: 0; bottom: 0; left: 50%;'
    }
`;

const LocationDot = styled.View`
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: #000;
    top: 50%;
    left: 50%;
    margin-top: -4px;
    margin-left: -4px;
`;

const WeatherInfo = styled.View`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    background-color: rgba(255, 255, 255, 0.9);
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
`;

const LocationInfo = styled.View`
    flex: 1;
`;

const CityText = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: ${theme.colors.text};
`;

const StateText = styled.Text`
    font-size: 14px;
    color: ${theme.colors.text};
    opacity: 0.7;
    margin-top: 2px;
`;

const CoordinatesText = styled.Text`
    font-size: 12px;
    color: ${theme.colors.text};
    opacity: 0.5;
    margin-top: 4px;
`;

const TemperatureInfo = styled.View`
    align-items: flex-end;
`;

const TempText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: ${theme.colors.text};
`;

const WeatherDescription = styled.Text`
    font-size: 12px;
    color: ${theme.colors.text};
    opacity: 0.7;
    margin-top: 2px;
`;

export default WeatherMap;
