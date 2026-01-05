import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { formatters } from '../../utils/formatters';
import { JobResponse } from '../../services/jobService';

interface JobCardProps {
    job: JobResponse;
    onPress: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onPress }) => {
    const isExpired = new Date(job.lastDate) < new Date();

    return (
        <TouchableOpacity onPress={onPress}>
            <Card style={styles.card} mode="outlined">
                <Card.Content>
                    <View style={styles.header}>
                        <View style={{ flex: 1 }}>
                            <Text variant="titleMedium" style={styles.companyName}>
                                {job.companyName}
                            </Text>
                            <Text variant="titleLarge" style={styles.title}>
                                {job.title}
                            </Text>
                        </View>
                        {!job.approved && (
                            <Chip mode="flat" style={styles.pendingChip}>
                                Pending
                            </Chip>
                        )}
                    </View>

                    <View style={styles.detailsRow}>
                        <View style={styles.detailItem}>
                            <Icon name="map-marker" size={16} color={colors.textSecondary} />
                            <Text style={styles.detailText}>{job.location}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Icon name="briefcase" size={16} color={colors.textSecondary} />
                            <Text style={styles.detailText}>{job.type}</Text>
                        </View>
                    </View>

                    <View style={styles.detailsRow}>
                        <View style={styles.detailItem}>
                            <Icon name="school" size={16} color={colors.textSecondary} />
                            <Text style={styles.detailText}>
                                Min CGPA: {formatters.formatCGPA(job.minCgpa)}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Icon
                                name="calendar"
                                size={16}
                                color={isExpired ? colors.error : colors.textSecondary}
                            />
                            <Text
                                style={[
                                    styles.detailText,
                                    isExpired && { color: colors.error },
                                ]}>
                                {formatters.formatDate(job.lastDate)}
                            </Text>
                        </View>
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
        marginBottom: 8,
    },
    companyName: {
        color: colors.primary,
        fontWeight: '600',
    },
    title: {
        fontWeight: 'bold',
        marginTop: 4,
    },
    pendingChip: {
        backgroundColor: colors.warning,
    },
    detailsRow: {
        flexDirection: 'row',
        marginTop: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    detailText: {
        marginLeft: 4,
        color: colors.textSecondary,
        fontSize: 14,
    },
});
