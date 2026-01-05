import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HelperText, Text } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../../theme/colors';

interface DropdownFieldProps {
    label: string;
    data: Array<{ label: string; value: any }>;
    value: any;
    onChange: (item: { label: string; value: any }) => void;
    placeholder?: string;
    error?: string;
}

export const DropdownField: React.FC<DropdownFieldProps> = ({
    label,
    data,
    value,
    onChange,
    placeholder = 'Select...',
    error,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Dropdown
                style={[styles.dropdown, error && styles.dropdownError]}
                data={data}
                labelField="label"
                valueField="value"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
            />
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
    dropdown: {
        height: 56,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 12,
        backgroundColor: colors.surface,
    },
    dropdownError: {
        borderColor: colors.error,
    },
    placeholderStyle: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: colors.text,
    },
});
