import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Text, Card, Button, IconButton } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { StatCard } from '../../components/cards/StatCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { jobService } from '../../services/jobService';
import { useNavigation } from '@react-navigation/native';

const RecruiterHomeScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setError(null);
      const jobsData = await jobService.getCompanyJobs();
      setJobs(jobsData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const getJobStats = () => {
    const total = jobs.length;
    const active = jobs.filter(
      j => j.approved && new Date(j.lastDate) >= new Date(),
    ).length;
    const pending = jobs.filter(j => !j.approved).length;
    return { total, active, pending };
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  const stats = getJobStats();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
        />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text variant="headlineMedium" style={styles.greeting}>
              Welcome, {user?.name}! 👋
            </Text>
            <Text style={styles.subtitle}>Recruiter Dashboard</Text>
          </View>
          <IconButton
            icon="logout"
            size={24}
            iconColor={colors.primary}
            onPress={handleLogout}
          />
        </View>
      </View>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Your Postings
      </Text>
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard
            title="Total Jobs"
            value={stats.total}
            icon="briefcase-outline"
            color={colors.primary}
          />
          <StatCard
            title="Active"
            value={stats.active}
            icon="briefcase-check"
            color={colors.success}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            title="Pending"
            value={stats.pending}
            icon="clock-outline"
            color={colors.warning}
          />
          <StatCard
            title="Applications"
            value="-"
            icon="account-group"
            color={colors.info}
          />
        </View>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Quick Actions
        </Text>
        <View style={styles.quickActions}>
          <Button
            mode="contained"
            icon="briefcase-plus"
            style={styles.actionButton}
            onPress={() => navigation.navigate('PostJob')}
          >
            Post New Job
          </Button>
          <Button
            mode="outlined"
            icon="view-list"
            style={styles.actionButton}
            onPress={() => navigation.navigate('MyJobs')}
          >
            View My Jobs
          </Button>
        </View>
      </View>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            📋 Quick Tips
          </Text>
          <Text style={styles.tipText}>
            • Keep job descriptions clear and detailed
          </Text>
          <Text style={styles.tipText}>• Set realistic CGPA requirements</Text>
          <Text style={styles.tipText}>• Respond to applications promptly</Text>
          <Text style={styles.tipText}>• Update job status regularly</Text>
        </Card.Content>
      </Card>

      {jobs.length > 0 && (
        <Card style={styles.recentCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Recent Postings
            </Text>
            {jobs.slice(0, 3).map((job, index) => (
              <View
                key={job.id}
                style={[styles.jobRow, index > 0 && styles.jobRowBorder]}
              >
                <View style={{ flex: 1 }}>
                  <Text variant="titleSmall">{job.title}</Text>
                  <Text variant="bodySmall" style={styles.jobLocation}>
                    {job.location}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: job.approved
                        ? colors.success
                        : colors.warning,
                    },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {job.approved ? 'APPROVED' : 'PENDING'}
                  </Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 16, paddingTop: 24 },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greeting: { fontWeight: 'bold', color: colors.text },
  subtitle: { color: colors.textSecondary, marginTop: 4, fontSize: 16 },
  sectionTitle: {
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  statsContainer: { paddingHorizontal: 8 },
  statsRow: { flexDirection: 'row', marginBottom: 0 },
  quickActionsContainer: { marginTop: 8 },
  quickActions: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  actionButton: { flex: 1 },
  infoCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.surface,
  },
  recentCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.surface,
  },
  cardTitle: { fontWeight: '600', marginBottom: 12 },
  tipText: { color: colors.text, marginBottom: 6, lineHeight: 20 },
  jobRow: { paddingVertical: 12 },
  jobRowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  jobLocation: { color: colors.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
});

export default RecruiterHomeScreen;
