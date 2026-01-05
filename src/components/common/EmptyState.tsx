import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';

interface EmptyStateProps {
  icon: string;
  message: string;
  title?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  message,
  title,
}) => {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={64} color={colors.textSecondary} />
      {title && (
        <Text variant="titleLarge" style={styles.title}>
          {title}
        </Text>
      )}
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    marginTop: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  text: {
    marginTop: 8,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
