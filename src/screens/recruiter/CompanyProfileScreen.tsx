import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, TextInput, Card } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  recruiterService,
  CompanyProfileRequest,
} from '../../services/recruiterService';

const CompanyProfileScreen = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CompanyProfileRequest>({
    companyName: '',
    description: '',
    website: '',
  });

  const handleSave = async () => {
    if (!formData.companyName.trim()) {
      Alert.alert('Error', 'Company name is required');
      return;
    }

    try {
      setSubmitting(true);
      await recruiterService.createOrUpdateCompany(formData);
      Alert.alert('Success', 'Company profile saved successfully!');
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Failed to save company profile',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Company Profile
        </Text>
        <Text style={styles.subtitle}>
          Set up or update your company information
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Company Details
          </Text>

          <TextInput
            label="Company Name *"
            value={formData.companyName}
            onChangeText={text =>
              setFormData({ ...formData, companyName: text })
            }
            mode="outlined"
            style={styles.input}
            error={!formData.companyName}
            placeholder="Enter your company name"
          />

          <TextInput
            label="Description"
            value={formData.description}
            onChangeText={text =>
              setFormData({ ...formData, description: text })
            }
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={5}
            placeholder="Describe your company, its mission, and culture..."
          />

          <TextInput
            label="Website"
            value={formData.website}
            onChangeText={text => setFormData({ ...formData, website: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="url"
            autoCapitalize="none"
            placeholder="https://www.yourcompany.com"
          />

          <Button
            mode="contained"
            onPress={handleSave}
            loading={submitting}
            disabled={submitting || !formData.companyName}
            style={styles.saveButton}
            icon="content-save"
          >
            Save Profile
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text variant="titleSmall" style={styles.infoTitle}>
            💡 Profile Tips
          </Text>
          <Text style={styles.infoText}>
            • A complete profile helps attract top talent
          </Text>
          <Text style={styles.infoText}>
            • Include your company's unique value propositions
          </Text>
          <Text style={styles.infoText}>
            • Keep information up-to-date and accurate
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
  saveButton: { marginTop: 8 },
  infoCard: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: colors.surface,
  },
  infoTitle: { fontWeight: '600', marginBottom: 8 },
  infoText: { color: colors.textSecondary, marginBottom: 4, lineHeight: 20 },
});

export default CompanyProfileScreen;
