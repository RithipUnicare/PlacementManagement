import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';

interface EmptyStateProps {
  icon: string;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, message }) => {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={64} color={colors.textSecondary} />
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
  text: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
