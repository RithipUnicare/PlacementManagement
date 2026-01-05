import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Text, Button, TextInput, Card } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { DropdownField } from '../../components/forms/DropdownField';
import { DatePickerField } from '../../components/forms/DatePickerField';
import { jobService, JobRequest } from '../../services/jobService';
import { useNavigation } from '@react-navigation/native';

const PostJobScreen = () => {
  const navigation = useNavigation<any>();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<JobRequest>({
    title: '',
    description: '',
    location: '',
    type: 'Full-time',
    minCgpa: 0,
    lastDate: new Date().toISOString().split('T')[0],
  });

  const jobTypes = [
    { label: 'Full-time', value: 'Full-time' },
    { label: 'Part-time', value: 'Part-time' },
    { label: 'Internship', value: 'Internship' },
  ];

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Job title is required');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Job description is required');
      return false;
    }
    if (!formData.location.trim()) {
      Alert.alert('Error', 'Location is required');
      return false;
    }
    if (formData.minCgpa < 0 || formData.minCgpa > 10) {
      Alert.alert('Error', 'CGPA must be between 0 and 10');
      return false;
    }
    if (new Date(formData.lastDate) < new Date()) {
      Alert.alert('Error', 'Application deadline must be in the future');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await jobService.createJob(formData);
      Alert.alert(
        'Success',
        'Job posted successfully! It will be visible after admin approval.',
        [{ text: 'OK', onPress: () => navigation.navigate('MyJobs') }],
      );
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    Alert.alert('Reset Form', 'Are you sure you want to clear all fields?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () =>
          setFormData({
            title: '',
            description: '',
            location: '',
            type: 'Full-time',
            minCgpa: 0,
            lastDate: new Date().toISOString().split('T')[0],
          }),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Post a New Job
        </Text>
        <Text style={styles.subtitle}>
          Fill in the job details to attract candidates
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Job Information
          </Text>

          <TextInput
            label="Job Title *"
            value={formData.title}
            onChangeText={text => setFormData({ ...formData, title: text })}
            mode="outlined"
            style={styles.input}
            error={!formData.title}
            placeholder="e.g., Software Developer, Data Analyst"
          />

          <TextInput
            label="Description *"
            value={formData.description}
            onChangeText={text =>
              setFormData({ ...formData, description: text })
            }
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={6}
            error={!formData.description}
            placeholder="Describe the role, responsibilities, and requirements..."
          />

          <TextInput
            label="Location *"
            value={formData.location}
            onChangeText={text => setFormData({ ...formData, location: text })}
            mode="outlined"
            style={styles.input}
            error={!formData.location}
            placeholder="e.g., Bangalore, Remote, Hybrid"
          />

          <DropdownField
            label="Job Type *"
            value={formData.type}
            onChange={item => setFormData({ ...formData, type: item.value })}
            data={jobTypes}
          />

          <TextInput
            label="Minimum CGPA *"
            value={formData.minCgpa.toString()}
            onChangeText={text => {
              const cgpa = parseFloat(text) || 0;
              setFormData({
                ...formData,
                minCgpa: Math.min(Math.max(cgpa, 0), 10),
              });
            }}
            mode="outlined"
            style={styles.input}
            keyboardType="decimal-pad"
            error={formData.minCgpa < 0 || formData.minCgpa > 10}
            placeholder="0.00 - 10.00"
          />

          <DatePickerField
            label="Application Deadline *"
            value={formData.lastDate}
            onChange={date => setFormData({ ...formData, lastDate: date })}
            minimumDate={new Date().toISOString().split('T')[0]}
          />

          <View style={styles.buttonRow}>
            <Button
              mode="outlined"
              onPress={handleReset}
              style={styles.button}
              disabled={submitting}
            >
              Reset
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              loading={submitting}
              disabled={submitting}
              icon="send"
            >
              Post Job
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text variant="titleSmall" style={styles.infoTitle}>
            📌 Important Notes
          </Text>
          <Text style={styles.infoText}>
            • Your job posting will be reviewed by admin before being published
          </Text>
          <Text style={styles.infoText}>
            • Provide clear and detailed job descriptions
          </Text>
          <Text style={styles.infoText}>• Set realistic CGPA requirements</Text>
          <Text style={styles.infoText}>
            • Allow sufficient time for students to apply
          </Text>
        </Card.Content>
      </Card>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 16, paddingTop: 24 },
  title: { fontWeight: 'bold', color: colors.text },
  subtitle: { color: colors.textSecondary, marginTop: 4 },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: colors.surface,
  },
  sectionTitle: { fontWeight: '600', marginBottom: 16 },
  input: { marginBottom: 16, backgroundColor: colors.surface },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  button: { flex: 1 },
  infoCard: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: colors.surface,
  },
  infoTitle: { fontWeight: '600', marginBottom: 8 },
  infoText: { color: colors.textSecondary, marginBottom: 4, lineHeight: 20 },
});

export default PostJobScreen;
