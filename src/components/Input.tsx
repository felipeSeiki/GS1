import React from 'react';
import { TextInput, TextInputProps, StyleSheet, Platform } from 'react-native';
import theme from '../styles/theme';

interface InputProps extends TextInputProps {
    error?: boolean;
}

export const Input: React.FC<InputProps> = ({ style, error, ...props }) => {
    return (
        <TextInput
            style={[
                styles.input,
                error && styles.errorInput,
                style
            ]}
            placeholderTextColor={theme.colors.secondary}
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: Platform.OS === 'ios' ? 12 : 8,
        fontSize: 16,
        color: theme.colors.text,
        width: '100%',
    },
    errorInput: {
        borderColor: theme.colors.error,
        borderWidth: 1,
    },
});