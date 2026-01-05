import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { formatters } from '../../utils/formatters';
import { ApplicationResponse } from '../../services/applicationService';

interface ApplicationCardProps {
    application: ApplicationResponse;
    onPress: () => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
    application,
    onPress,
}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Card style={styles.card} mode="outlined">
                <Card.Content>
                    <View style={styles.header}>
                        <View style={{ flex: 1 }}>
                            <Text variant="titleLarge" style={styles.title}>
                                {application.jobTitle}
                            </Text>
                            <Text style={styles.appliedDate}>
                                Applied: {formatters.formatDateTime(application.appliedAt)}
                            </Text>
                        </View>
                        <Chip
                            mode="flat"
                            style={[
                                styles.statusChip,
                                { backgroundColor: formatters.getStatusColor(application.status) },
                            ]}
                            textStyle={styles.statusText}>
                            {formatters.capitalize(application.status.replace('_', ' '))}
                        </Chip>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: colors.surface,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontWeight: 'bold',
    },
    appliedDate: {
        color: colors.textSecondary,
        fontSize: 14,
        marginTop: 4,
    },
    statusChip: {
        marginLeft: 8,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
    },
});
