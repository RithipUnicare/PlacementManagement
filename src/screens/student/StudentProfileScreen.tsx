import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, TextInput, Card } from 'react-native-paper';
import { pick } from '@react-native-documents/picker';
import { colors } from '../../theme/colors';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import {
  studentService,
  StudentProfileRequest,
} from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';

const StudentProfileScreen = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState<StudentProfileRequest>({
    rollNumber: '',
    department: '',
    year: 1,
    cgpa: 0,
    skills: '',
  });

  const fetchProfile = async () => {
    try {
      setError(null);
      const isSuperAdmin = user?.roles === 'ROLE_SUPERADMIN';

      if (isSuperAdmin) {
        try {
          const data = await studentService.getMyProfile();
          setProfile(data);
          setFormData({
            rollNumber: data.rollNumber || '',
            department: data.department || '',
            year: data.year || 1,
            cgpa: data.cgpa || 0,
            skills: data.skills || '',
          });
        } catch (apiErr) {
          console.error('Failed to fetch student profile:', apiErr);
          const fallbackData = {
            rollNumber: 'NOT_SET',
            department: 'General',
            year: 1,
            cgpa: 0,
            skills: '',
            placementStatus: 'NOT_PLACED',
          };
          setProfile(fallbackData);
          setFormData(fallbackData);
        }
      } else {
        // Fallback for non-superadmins as student/me is not ready
        const fallbackData = {
          rollNumber: 'NOT_SET',
          department: 'General',
          year: 1,
          cgpa: 0,
          skills: '',
          placementStatus: 'NOT_PLACED',
        };
        setProfile(fallbackData);
        setFormData(fallbackData);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (
      !formData.rollNumber ||
      !formData.department ||
      !formData.year ||
      !formData.cgpa
    ) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (formData.cgpa < 0 || formData.cgpa > 10) {
      Alert.alert('Error', 'CGPA must be between 0 and 10');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await studentService.updateProfile(formData);
      Alert.alert('Success', 'Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Failed to update profile',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      rollNumber: profile.rollNumber || '',
      department: profile.department || '',
      year: profile.year || 1,
      cgpa: profile.cgpa || 0,
      skills: profile.skills || '',
    });
    setEditing(false);
  };

  const handleResumePick = async () => {
    try {
      const [result] = await pick({
        type: ['application/pdf'],
      });

      if (result) {
        setProfile({
          ...profile,
          resumePath: result.name,
        });
        Alert.alert(
          'Success',
          `Selected: ${result.name}. In a real app, this would be uploaded to the server.`,
        );
      }
    } catch (err: any) {
      if (err.message !== 'User cancelled') {
        Alert.alert('Error', 'Failed to pick document');
        console.log('Picker Error:', err);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !profile) {
    return <ErrorMessage message={error} onRetry={fetchProfile} />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Student Profile
        </Text>
        <Text style={styles.subtitle}>Manage Your Academic Details</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Personal Information
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user?.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Mobile:</Text>
            <Text style={styles.value}>{user?.mobileNumber}</Text>
          </View>
          {user?.email && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Academic Details
            </Text>
            {!editing && (
              <Button mode="outlined" onPress={() => setEditing(true)} compact>
                Edit
              </Button>
            )}
          </View>

          <TextInput
            label="Roll Number *"
            value={formData.rollNumber}
            onChangeText={text =>
              setFormData({ ...formData, rollNumber: text })
            }
            mode="outlined"
            style={styles.input}
            disabled={!editing}
            error={editing && !formData.rollNumber}
          />

          <TextInput
            label="Department *"
            value={formData.department}
            onChangeText={text =>
              setFormData({ ...formData, department: text })
            }
            mode="outlined"
            style={styles.input}
            disabled={!editing}
            error={editing && !formData.department}
            placeholder="e.g., Computer Science"
          />

          <TextInput
            label="Year *"
            value={formData.year.toString()}
            onChangeText={text => {
              const year = parseInt(text) || 1;
              setFormData({
                ...formData,
                year: Math.min(Math.max(year, 1), 4),
              });
            }}
            mode="outlined"
            style={styles.input}
            disabled={!editing}
            keyboardType="number-pad"
            error={editing && !formData.year}
            placeholder="1-4"
          />

          <TextInput
            label="CGPA *"
            value={formData.cgpa.toString()}
            onChangeText={text => {
              const cgpa = parseFloat(text) || 0;
              setFormData({
                ...formData,
                cgpa: Math.min(Math.max(cgpa, 0), 10),
              });
            }}
            mode="outlined"
            style={styles.input}
            disabled={!editing}
            keyboardType="decimal-pad"
            error={
              editing &&
              (!formData.cgpa || formData.cgpa < 0 || formData.cgpa > 10)
            }
            placeholder="0.00 - 10.00"
          />

          <TextInput
            label="Skills"
            value={formData.skills}
            onChangeText={text => setFormData({ ...formData, skills: text })}
            mode="outlined"
            style={styles.input}
            disabled={!editing}
            multiline
            numberOfLines={3}
            placeholder="e.g., Java, Python, React"
          />

          {editing && (
            <View style={styles.buttonRow}>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={styles.button}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.button}
                loading={submitting}
                disabled={submitting}
              >
                Save
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Resume
          </Text>
          {profile?.resumePath ? (
            <View style={styles.resumeSection}>
              <Text style={styles.resumeText}>Resume uploaded ✓</Text>
              <Text style={styles.resumePath}>{profile.resumePath}</Text>
            </View>
          ) : (
            <Text style={styles.noResume}>No resume uploaded yet</Text>
          )}
          <Button
            mode="outlined"
            icon="upload"
            style={{ marginTop: 12 }}
            onPress={handleResumePick}
          >
            Upload Resume
          </Button>
          <Text style={styles.note}>
            Note: Resume is picked locally. Server upload logic would follow.
          </Text>
        </Card.Content>
      </Card>

      {profile?.placementStatus && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Placement Status
            </Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    profile.placementStatus === 'PLACED'
                      ? colors.success
                      : colors.warning,
                },
              ]}
            >
              <Text style={styles.statusText}>{profile.placementStatus}</Text>
            </View>
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
  title: { fontWeight: 'bold', color: colors.text },
  subtitle: { color: colors.textSecondary, marginTop: 4 },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: colors.surface,
  },
  sectionTitle: { fontWeight: '600', marginBottom: 12 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    width: 100,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  value: {
    flex: 1,
    color: colors.text,
  },
  input: {
    marginBottom: 12,
    backgroundColor: colors.surface,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  button: {
    flex: 1,
  },
  resumeSection: {
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  resumeText: {
    color: colors.success,
    fontWeight: '600',
    marginBottom: 4,
  },
  resumePath: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  noResume: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  note: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default StudentProfileScreen;
