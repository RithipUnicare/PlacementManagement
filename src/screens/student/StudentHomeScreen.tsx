import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, Card, Button, IconButton } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { StatCard } from '../../components/cards/StatCard';
import { JobCard } from '../../components/cards/JobCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { studentService } from '../../services/studentService';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { useNavigation } from '@react-navigation/native';

const StudentHomeScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const isSuperAdmin = user?.roles === 'ROLE_SUPERADMIN';

      const fetchPromises: any[] = [
        applicationService.getMyApplications(),
        jobService.getApprovedJobs(),
      ];

      // Only call student profile if user is SUPERADMIN
      if (isSuperAdmin) {
        try {
          const profileData = await studentService.getMyProfile();
          setProfile(profileData);
        } catch (err) {
          console.log('Failed to fetch student profile:', err);
          // Fallback dummy data if API fails
          setProfile({
            department: 'Set Profile',
            year: 0,
            cgpa: 0,
          });
        }
      } else {
        // Mock profile data for standard students as the endpoint is not ready
        setProfile({
          department: 'Set Profile',
          year: 0,
          cgpa: 0,
        });
      }

      const [applicationsData, jobsData] = await Promise.all([
        applicationService.getMyApplications(),
        jobService.getApprovedJobs(),
      ]);

      setApplications(applicationsData);
      setRecentJobs(jobsData.slice(0, 3));
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

  const getApplicationStats = () => {
    const total = applications.length;
    const shortlisted = applications.filter(
      a => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED',
    ).length;
    const offered = applications.filter(a => a.status === 'OFFERED').length;
    return { total, shortlisted, offered };
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // if (error) {
  //   return (
  //     <ErrorMessage
  //       message={error}
  //       onRetry={fetchData}
  //       fullScreen
  //       title="Unable to Load Dashboard"
  //     />
  //   );
  // }

  const stats = getApplicationStats();

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
              Welcome back, {user?.name}! 👋
            </Text>
            <Text style={styles.subtitle}>
              {profile?.department || 'Department not set'} • Year{' '}
              {profile?.year || 'N/A'}
            </Text>
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
        Your Progress
      </Text>
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard
            title="Applications"
            value={stats.total}
            icon="file-document-outline"
            color={colors.primary}
          />
          <StatCard
            title="Shortlisted"
            value={stats.shortlisted}
            icon="briefcase-check"
            color={colors.info}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            title="Offers"
            value={stats.offered}
            icon="trophy-award"
            color={colors.success}
          />
          <StatCard
            title="CGPA"
            value={profile?.cgpa?.toFixed(2) || 'N/A'}
            icon="school"
            color={colors.warning}
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
            icon="briefcase-search"
            style={styles.actionButton}
            onPress={() => navigation.navigate('JobsList')}
          >
            Browse Jobs
          </Button>
          <Button
            mode="outlined"
            icon="account"
            style={styles.actionButton}
            onPress={() => navigation.navigate('StudentProfile')}
          >
            View Profile
          </Button>
        </View>
      </View>

      {recentJobs.length > 0 && (
        <>
          <View style={styles.jobsHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Recent Opportunities
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('JobsList')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          {recentJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onPress={() => navigation.navigate('JobDetails', { job })}
            />
          ))}
        </>
      )}

      {applications.length > 0 && (
        <>
          <View style={styles.jobsHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Recent Applications
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('MyApplications')}
            >
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <Card style={styles.statusCard}>
            <Card.Content>
              {applications.slice(0, 3).map((app, index) => (
                <View
                  key={app.applicationId}
                  style={[styles.appRow, index > 0 && styles.appRowBorder]}
                >
                  <View style={{ flex: 1 }}>
                    <Text variant="titleSmall">{app.jobTitle}</Text>
                    <Text variant="bodySmall" style={styles.appDate}>
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          app.status === 'OFFERED'
                            ? colors.success
                            : app.status === 'SHORTLISTED' ||
                              app.status === 'INTERVIEW_SCHEDULED'
                            ? colors.info
                            : app.status === 'REJECTED'
                            ? colors.error
                            : colors.warning,
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>{app.status}</Text>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        </>
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
  jobsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  seeAll: { color: colors.primary, fontWeight: '600' },
  statusCard: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: colors.surface,
  },
  appRow: { paddingVertical: 12 },
  appRowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  appDate: { color: colors.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
});

export default StudentHomeScreen;
