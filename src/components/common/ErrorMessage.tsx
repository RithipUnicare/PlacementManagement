import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
  title?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  fullScreen = false,
  title = 'Error',
}) => {
  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <Icon name="alert-circle-outline" size={64} color={colors.error} />
        <Text variant="headlineSmall" style={styles.fullScreenTitle}>
          {title}
        </Text>
        <Text style={styles.fullScreenMessage}>{message}</Text>
        {onRetry && (
          <Button
            mode="contained"
            onPress={onRetry}
            style={styles.retryButton}
            icon="refresh"
          >
            Try Again
          </Button>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Icon name="alert-circle" size={20} color={colors.error} />
      <Text style={styles.text}>{message}</Text>
      {onRetry && (
        <Button
          mode="outlined"
          onPress={onRetry}
          compact
          textColor={colors.error}
        >
          Retry
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  text: {
    marginLeft: 8,
    marginRight: 8,
    color: colors.error,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  fullScreenTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: colors.text,
    fontWeight: '600',
  },
  fullScreenMessage: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: 300,
  },
  retryButton: {
    minWidth: 150,
  },
});
