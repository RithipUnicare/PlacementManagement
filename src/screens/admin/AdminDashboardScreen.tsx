import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { StatCard } from '../../components/cards/StatCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { adminService, DashboardResponse } from '../../services/adminService';

const AdminDashboardScreen = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardResponse | null>(null);

  const fetchDashboard = async () => {
    try {
      setError(null);
      const data = await adminService.getDashboard();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={fetchDashboard}
        fullScreen
        title="Unable to Load Dashboard"
      />
    );
  }

  const placementRate =
    stats && stats.totalStudents > 0
      ? ((stats.placedStudents / stats.totalStudents) * 100).toFixed(1)
      : '0';

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
              Admin Dashboard 🎯
            </Text>
            <Text style={styles.subtitle}>System Overview & Statistics</Text>
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
        Student Statistics
      </Text>
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon="account-group"
            color={colors.primary}
          />
          <StatCard
            title="Placed Students"
            value={stats?.placedStudents || 0}
            icon="account-check"
            color={colors.success}
          />
        </View>
      </View>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Recruitment Statistics
      </Text>
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard
            title="Total Companies"
            value={stats?.totalCompanies || 0}
            icon="domain"
            color={colors.info}
          />
          <StatCard
            title="Active Jobs"
            value={stats?.activeJobs || 0}
            icon="briefcase"
            color={colors.warning}
          />
        </View>
      </View>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Key Metrics
      </Text>
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard
            title="Placement Rate"
            value={`${placementRate}%`}
            icon="chart-line"
            color={colors.success}
          />
          <StatCard
            title="Avg Jobs/Company"
            value={
              stats && stats.totalCompanies > 0
                ? (stats.activeJobs / stats.totalCompanies).toFixed(1)
                : '0'
            }
            icon="briefcase-account"
            color={colors.primary}
          />
        </View>
      </View>

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
});

export default AdminDashboardScreen;
