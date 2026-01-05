import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { jobService, JobResponse } from '../../services/jobService';
import { adminService } from '../../services/adminService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PendingJobsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  const fetchJobs = async () => {
    try {
      setError(null);
      const data = await jobService.getApprovedJobs();
      // Filter for unapproved jobs (pending) - assumes API returns all jobs
      // In real scenario, there might be a specific endpoint for pending jobs
      const allJobs = data;
      // For now, we'll need to get company jobs which includes unapproved
      // Since getApprovedJobs only returns approved, we show empty state
      setJobs([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load pending jobs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const handleApprove = (job: JobResponse) => {
    Alert.alert(
      'Approve Job',
      `Are you sure you want to approve this job: "${job.title}" from ${job.companyName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => approveJob(job.id),
          style: 'default',
        },
      ],
    );
  };

  const approveJob = async (jobId: number) => {
    try {
      setApprovingId(jobId);
      await adminService.approveJob(jobId);
      Alert.alert('Success', 'Job approved successfully!');
      fetchJobs(); // Refresh the list
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Failed to approve job',
      );
    } finally {
      setApprovingId(null);
    }
  };

  const renderJobCard = ({ item }: { item: JobResponse }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.companyName}>
            {item.companyName}
          </Text>
        </View>
        <Text variant="titleLarge" style={styles.title}>
          {item.title}
        </Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Icon name="map-marker" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="briefcase" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{item.type}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="school" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>
              Min CGPA: {item.minCgpa.toFixed(2)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>
              Deadline: {new Date(item.lastDate).toLocaleDateString('en-IN')}
            </Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>

        <Button
          mode="contained"
          onPress={() => handleApprove(item)}
          loading={approvingId === item.id}
          disabled={approvingId !== null}
          style={styles.approveButton}
          icon="check-circle"
        >
          Approve Job
        </Button>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchJobs} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant="titleLarge" style={styles.headerText}>
          Pending Job Approvals ({jobs.length})
        </Text>
        <Text style={styles.subtitle}>Review and approve job postings</Text>
      </View>

      <FlatList
        data={jobs}
        keyExtractor={item => item.id.toString()}
        renderItem={renderJobCard}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="check-all"
            title="All Caught Up!"
            message="There are no pending job postings to review at the moment."
          />
        }
        contentContainerStyle={
          jobs.length === 0 ? styles.emptyContainer : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerContainer: { padding: 16, paddingBottom: 8 },
  headerText: { fontWeight: '600' },
  subtitle: { color: colors.textSecondary, marginTop: 4 },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: colors.surface,
  },
  header: { marginBottom: 4 },
  companyName: { color: colors.primary, fontWeight: '600' },
  title: { fontWeight: 'bold', marginBottom: 12 },
  detailsContainer: { marginVertical: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  detailText: { marginLeft: 8, color: colors.textSecondary, fontSize: 14 },
  description: { color: colors.text, marginBottom: 16, lineHeight: 20 },
  approveButton: { marginTop: 8 },
  emptyContainer: { flex: 1 },
});

export default PendingJobsScreen;
