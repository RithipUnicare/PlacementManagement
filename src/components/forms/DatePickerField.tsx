import React, { useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Button, HelperText, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../theme/colors';
import { formatters } from '../../utils/formatters';

interface DatePickerFieldProps {
    label: string;
    value: Date;
    onChange: (date: Date) => void;
    error?: string;
    mode?: 'date' | 'time' | 'datetime';
    minimumDate?: Date;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
    label,
    value,
    onChange,
    error,
    mode = 'date',
    minimumDate,
}) => {
    const [show, setShow] = useState(false);

    const handleChange = (event: any, selectedDate?: Date) => {
        setShow(Platform.OS === 'ios');
        if (selectedDate) {
            onChange(selectedDate);
        }
    };

    const getDisplayValue = () => {
        if (mode === 'date') {
            return formatters.formatDate(value.toISOString());
        } else if (mode === 'datetime') {
            return formatters.formatDateTime(value.toISOString());
        }
        return value.toLocaleTimeString();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Button
                mode="outlined"
                onPress={() => setShow(true)}
                style={[styles.button, error && styles.buttonError]}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}>
                {getDisplayValue()}
            </Button>
            {show && (
                <DateTimePicker
                    value={value}
                    mode={mode}
                    onChange={handleChange}
                    minimumDate={minimumDate}
                />
            )}
            {error && (
                <HelperText type="error" visible={!!error}>
                    {error}
                </HelperText>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    button: {
        borderColor: colors.border,
    },
    buttonError: {
        borderColor: colors.error,
    },
    buttonContent: {
        justifyContent: 'flex-start',
        height: 56,
    },
    buttonLabel: {
        color: colors.text,
        fontSize: 16,
    },
});
