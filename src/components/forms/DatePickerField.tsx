import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, Text } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import { colors } from '../../theme/colors';
import { formatters } from '../../utils/formatters';

interface DatePickerFieldProps {
  label: string;
  value: string; // ISO string
  onChange: (date: string) => void;
  error?: string;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: string;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  error,
  mode = 'date',
  minimumDate,
}) => {
  const [open, setOpen] = useState(false);
  const dateValue = value ? new Date(value) : new Date();

  const getDisplayValue = () => {
    if (!value) return 'Select...';
    if (mode === 'date') {
      return formatters.formatDate(value);
    } else if (mode === 'datetime') {
      return formatters.formatDateTime(value);
    }
    return dateValue.toLocaleTimeString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Button
        mode="outlined"
        onPress={() => setOpen(true)}
        style={[styles.button, error && styles.buttonError]}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        {getDisplayValue()}
      </Button>
      <DatePicker
        modal
        open={open}
        date={dateValue}
        mode={mode}
        minimumDate={minimumDate ? new Date(minimumDate) : undefined}
        onConfirm={date => {
          setOpen(false);
          onChange(date.toISOString().split('T')[0]);
        }}
        onCancel={() => {
          setOpen(false);
        }}
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
