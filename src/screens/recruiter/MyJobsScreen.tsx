import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { JobCard } from '../../components/cards/JobCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { jobService, JobResponse } from '../../services/jobService';

const MyJobsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobResponse[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setError(null);
      const data = await jobService.getCompanyJobs();
      setJobs(data);
      setFilteredJobs(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (selectedStatus === 'approved') {
      filtered = filtered.filter(job => job.approved);
    } else if (selectedStatus === 'pending') {
      filtered = filtered.filter(job => !job.approved);
    }

    setFilteredJobs(filtered);
  }, [selectedStatus, jobs]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchJobs} />;
  }

  const approvedCount = jobs.filter(j => j.approved).length;
  const pendingCount = jobs.filter(j => !j.approved).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.headerText}>
          My Job Postings ({jobs.length})
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <Chip
          selected={selectedStatus === null}
          onPress={() => setSelectedStatus(null)}
          style={styles.chip}
        >
          All ({jobs.length})
        </Chip>
        <Chip
          selected={selectedStatus === 'approved'}
          onPress={() =>
            setSelectedStatus(selectedStatus === 'approved' ? null : 'approved')
          }
          style={styles.chip}
        >
          Approved ({approvedCount})
        </Chip>
        <Chip
          selected={selectedStatus === 'pending'}
          onPress={() =>
            setSelectedStatus(selectedStatus === 'pending' ? null : 'pending')
          }
          style={styles.chip}
        >
          Pending ({pendingCount})
        </Chip>
      </View>

      <FlatList
        data={filteredJobs}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <JobCard job={item} onPress={() => {}} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="briefcase-off"
            title="No Jobs Posted"
            message="You haven't posted any jobs yet. Start by creating your first job posting!"
          />
        }
        contentContainerStyle={
          filteredJobs.length === 0 ? styles.emptyContainer : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 16, paddingBottom: 8 },
  headerText: { fontWeight: '600' },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    gap: 8,
  },
  chip: { marginRight: 0 },
  emptyContainer: { flex: 1 },
});

export default MyJobsScreen;
