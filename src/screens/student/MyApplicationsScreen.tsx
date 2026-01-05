import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { ApplicationCard } from '../../components/cards/ApplicationCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import {
  applicationService,
  ApplicationResponse,
} from '../../services/applicationService';

const MyApplicationsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    ApplicationResponse[]
  >([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setError(null);
      const data = await applicationService.getMyApplications();
      setApplications(data);
      setFilteredApplications(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (selectedStatus) {
      setFilteredApplications(
        applications.filter(app => app.status === selectedStatus),
      );
    } else {
      setFilteredApplications(applications);
    }
  }, [selectedStatus, applications]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplications();
  };

  const statusFilters = [
    'APPLIED',
    'SHORTLISTED',
    'INTERVIEW_SCHEDULED',
    'OFFERED',
    'REJECTED',
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  // if (error) {
  //   return (
  //     <ErrorMessage
  //       message={error}
  //       onRetry={fetchApplications}
  //       fullScreen
  //       title="Unable to Load Applications"
  //     />
  //   );
  // }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.headerText}>
          My Applications ({applications.length})
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <Chip
          selected={selectedStatus === null}
          onPress={() => setSelectedStatus(null)}
          style={styles.chip}
        >
          All
        </Chip>
        {statusFilters.map(status => (
          <Chip
            key={status}
            selected={selectedStatus === status}
            onPress={() =>
              setSelectedStatus(selectedStatus === status ? null : status)
            }
            style={styles.chip}
          >
            {status.replace('_', ' ')}
          </Chip>
        ))}
      </View>

      <FlatList
        data={filteredApplications}
        keyExtractor={item => item.applicationId.toString()}
        renderItem={({ item }) => (
          <ApplicationCard application={item} onPress={() => {}} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="clipboard-text-outline"
            title="No Applications Yet"
            message="You haven't applied to any jobs yet. Start exploring opportunities!"
          />
        }
        contentContainerStyle={
          filteredApplications.length === 0 ? styles.emptyContainer : undefined
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
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: { marginRight: 0 },
  emptyContainer: { flex: 1 },
});

export default MyApplicationsScreen;
