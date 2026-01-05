import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    multiline?: boolean;
    numberOfLines?: number;
    disabled?: boolean;
    placeholder?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
    label,
    value,
    onChangeText,
    error,
    secureTextEntry = false,
    keyboardType = 'default',
    multiline = false,
    numberOfLines = 1,
    disabled = false,
    placeholder,
}) => {
    return (
        <>
            <TextInput
                label={label}
                value={value}
                onChangeText={onChangeText}
                mode="outlined"
                error={!!error}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={numberOfLines}
                disabled={disabled}
                placeholder={placeholder}
                style={styles.input}
            />
            {error && (
                <HelperText type="error" visible={!!error}>
                    {error}
                </HelperText>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    input: {
        marginBottom: 8,
    },
});
