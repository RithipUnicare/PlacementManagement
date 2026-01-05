import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Searchbar, Chip } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { JobCard } from '../../components/cards/JobCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { jobService, JobResponse } from '../../services/jobService';
import { useNavigation } from '@react-navigation/native';

const JobsListScreen = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setError(null);
      const data = await jobService.getApprovedJobs();
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

    if (searchQuery) {
      filtered = filtered.filter(
        job =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedType) {
      filtered = filtered.filter(job => job.type === selectedType);
    }

    setFilteredJobs(filtered);
  }, [searchQuery, selectedType, jobs]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const jobTypes = ['Full-time', 'Part-time', 'Internship'];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={fetchJobs}
        fullScreen
        title="Unable to Load Jobs"
      />
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search jobs, companies, locations..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <View style={styles.filterContainer}>
        <Chip
          selected={selectedType === null}
          onPress={() => setSelectedType(null)}
          style={styles.chip}
        >
          All
        </Chip>
        {jobTypes.map(type => (
          <Chip
            key={type}
            selected={selectedType === type}
            onPress={() => setSelectedType(selectedType === type ? null : type)}
            style={styles.chip}
          >
            {type}
          </Chip>
        ))}
      </View>

      <FlatList
        data={filteredJobs}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => navigation.navigate('JobDetails', { job: item })}
          />
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
            icon="briefcase-search"
            title="No Jobs Found"
            message="There are no job opportunities matching your search criteria."
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
  searchbar: { margin: 16, marginBottom: 8 },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  chip: { marginRight: 0 },
  emptyContainer: { flex: 1 },
});

export default JobsListScreen;
