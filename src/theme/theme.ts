import { MD3LightTheme } from 'react-native-paper';
import { colors } from './colors';

export const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: colors.primary,
        primaryContainer: colors.primaryLight,
        secondary: colors.secondary,
        secondaryContainer: colors.secondary,
        background: colors.background,
        surface: colors.surface,
        error: colors.error,
        onPrimary: '#FFFFFF',
        onSecondary: '#000000',
        onBackground: colors.text,
        onSurface: colors.text,
    },
};

export type AppTheme = typeof theme;
