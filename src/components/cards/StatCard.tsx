import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color?: string;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = colors.primary,
  subtitle,
}) => {
  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Icon name={icon} size={32} color={color} />
        </View>
        <View style={styles.textContainer}>
          <Text variant="headlineMedium" style={styles.value}>
            {value}
          </Text>
          <Text variant="bodyMedium" style={styles.title}>
            {title}
          </Text>
          {subtitle && (
            <Text variant="bodySmall" style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  value: {
    fontWeight: 'bold',
    color: colors.text,
  },
  title: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 1,
  },
});
