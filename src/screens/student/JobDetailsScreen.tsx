import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Chip, Divider } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { JobResponse } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface JobDetailsScreenProps {
  route: {
    params: {
      job: JobResponse;
    };
  };
}

const JobDetailsScreen: React.FC<JobDetailsScreenProps> = ({ route }) => {
  const { job } = route.params;
  const navigation = useNavigation<any>();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const isExpired = new Date(job.lastDate) < new Date();
  const daysLeft = Math.ceil(
    (new Date(job.lastDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const handleApply = () => {
    Alert.alert(
      'Confirm Application',
      `Are you sure you want to apply for ${job.title} at ${job.companyName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Apply', onPress: submitApplication, style: 'default' },
      ],
    );
  };

  const submitApplication = async () => {
    try {
      setApplying(true);
      await applicationService.applyForJob(job.id);
      setApplied(true);
      Alert.alert(
        'Success',
        'Your application has been submitted successfully!',
        [
          {
            text: 'View Applications',
            onPress: () => navigation.navigate('MyApplications'),
          },
          { text: 'OK', style: 'default' },
        ],
      );
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to apply for job';
      Alert.alert('Error', errorMsg);
      if (errorMsg.includes('already applied')) {
        setApplied(true);
      }
    } finally {
      setApplying(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.companyName}>
            {job.companyName}
          </Text>
          <Text variant="headlineMedium" style={styles.jobTitle}>
            {job.title}
          </Text>
          <View style={styles.badges}>
            <Chip
              mode="flat"
              style={[styles.typeChip, { backgroundColor: colors.primary }]}
              textStyle={styles.chipText}
            >
              {job.type}
            </Chip>
            {!isExpired && daysLeft <= 7 && (
              <Chip
                mode="flat"
                style={[styles.urgentChip, { backgroundColor: colors.warning }]}
                textStyle={styles.chipText}
              >
                {daysLeft} days left!
              </Chip>
            )}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Job Details
          </Text>
          <Divider style={styles.divider} />

          <View style={styles.detailRow}>
            <Icon name="map-marker" size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{job.location}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="briefcase" size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Job Type</Text>
              <Text style={styles.detailValue}>{job.type}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="school" size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Minimum CGPA</Text>
              <Text style={styles.detailValue}>{job.minCgpa.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon
              name="calendar"
              size={20}
              color={isExpired ? colors.error : colors.primary}
            />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Application Deadline</Text>
              <Text
                style={[
                  styles.detailValue,
                  isExpired && { color: colors.error },
                ]}
              >
                {new Date(job.lastDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Description
          </Text>
          <Divider style={styles.divider} />
          <Text style={styles.description}>{job.description}</Text>
        </Card.Content>
      </Card>

      <View style={styles.applyContainer}>
        {isExpired ? (
          <Text style={styles.expiredText}>This job posting has expired</Text>
        ) : (
          <Button
            mode="contained"
            onPress={handleApply}
            loading={applying}
            disabled={applying || applied}
            style={styles.applyButton}
            contentStyle={styles.applyButtonContent}
            icon="send"
          >
            {applied ? 'Already Applied' : 'Apply Now'}
          </Button>
        )}
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerCard: { margin: 16, marginBottom: 8, backgroundColor: colors.surface },
  companyName: { color: colors.primary, fontWeight: '600', marginBottom: 4 },
  jobTitle: { fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  badges: { flexDirection: 'row', gap: 8 },
  typeChip: {},
  urgentChip: {},
  chipText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: colors.surface,
  },
  sectionTitle: { fontWeight: '600', marginBottom: 8 },
  divider: { marginBottom: 16 },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  detailContent: { marginLeft: 16, flex: 1 },
  detailLabel: { color: colors.textSecondary, fontSize: 14, marginBottom: 4 },
  detailValue: { color: colors.text, fontSize: 16, fontWeight: '500' },
  description: { color: colors.text, lineHeight: 24 },
  applyContainer: { marginHorizontal: 16, marginTop: 8 },
  applyButton: {},
  applyButtonContent: { paddingVertical: 8 },
  expiredText: {
    color: colors.error,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
  },
});

export default JobDetailsScreen;
