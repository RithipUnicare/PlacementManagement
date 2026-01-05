import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, TextInput, Card, Divider } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { userService, UserEditRequest } from '../../services/userService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileEditScreen = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UserEditRequest>({
    name: user?.name || '',
    mobileNumber: user?.mobileNumber || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        mobileNumber: user.mobileNumber || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    if (!formData.mobileNumber?.trim()) {
      Alert.alert('Error', 'Mobile number is required');
      return;
    }

    // Basic mobile number validation (10 digits)
    if (formData.mobileNumber && !/^\d{10}$/.test(formData.mobileNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    // Basic email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await userService.editProfile(formData);
      Alert.alert(
        'Success',
        'Profile updated successfully! Please login again for changes to take effect.',
        [
          {
            text: 'Logout Now',
            onPress: logout,
          },
          { text: 'Later', style: 'cancel' },
        ],
      );
      setEditing(false);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      mobileNumber: user?.mobileNumber || '',
      email: user?.email || '',
    });
    setEditing(false);
    setError(null);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const getRoleColor = (role?: string) => {
    if (!role) return colors.textSecondary;
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return colors.roleAdmin;
      case 'RECRUITER':
        return colors.roleRecruiter;
      case 'STUDENT':
        return colors.roleStudent;
      default:
        return colors.textSecondary;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View
            style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}
          >
            <Icon name="account" size={48} color={colors.primary} />
          </View>
        </View>
        <Text variant="headlineSmall" style={styles.nameText}>
          {user?.name}
        </Text>
        <View
          style={[
            styles.roleBadge,
            { backgroundColor: getRoleColor(user?.roles) },
          ]}
        >
          <Text style={styles.roleText}>{user?.roles || 'USER'}</Text>
        </View>
      </View>

      {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Personal Information
            </Text>
            {!editing && (
              <Button
                mode="outlined"
                onPress={() => setEditing(true)}
                compact
                icon="pencil"
              >
                Edit
              </Button>
            )}
          </View>

          <Divider style={styles.divider} />

          {!editing ? (
            <>
              <View style={styles.infoRow}>
                <Icon name="account-outline" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.label}>Name</Text>
                  <Text style={styles.value}>{user?.name}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Icon name="phone-outline" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.label}>Mobile Number</Text>
                  <Text style={styles.value}>{user?.mobileNumber}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Icon name="email-outline" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.value}>
                    {user?.email || 'Not provided'}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <TextInput
                label="Name *"
                value={formData.name}
                onChangeText={text => setFormData({ ...formData, name: text })}
                mode="outlined"
                style={styles.input}
                disabled={!editing}
                error={editing && !formData.name}
                left={<TextInput.Icon icon="account-outline" />}
              />

              <TextInput
                label="Mobile Number *"
                value={formData.mobileNumber}
                onChangeText={text =>
                  setFormData({ ...formData, mobileNumber: text })
                }
                mode="outlined"
                style={styles.input}
                disabled={!editing}
                keyboardType="phone-pad"
                maxLength={10}
                error={editing && !formData.mobileNumber}
                left={<TextInput.Icon icon="phone-outline" />}
              />

              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={text => setFormData({ ...formData, email: text })}
                mode="outlined"
                style={styles.input}
                disabled={!editing}
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email-outline" />}
              />

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
                  Save Changes
                </Button>
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Account Actions
          </Text>
          <Divider style={styles.divider} />
          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.logoutButton}
            buttonColor={colors.error}
            icon="logout"
          >
            Logout
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text variant="titleSmall" style={styles.infoTitle}>
            ℹ️ Account Information
          </Text>
          <Text style={styles.infoText}>
            • Name and mobile number changes require re-login
          </Text>
          <Text style={styles.infoText}>
            • Keep your contact information up-to-date
          </Text>
          <Text style={styles.infoText}>
            • Contact admin to change your role
          </Text>
        </Card.Content>
      </Card>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'center', padding: 24, paddingTop: 32 },
  avatarContainer: { marginBottom: 16 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: { fontWeight: 'bold', marginBottom: 8 },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: colors.surface,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontWeight: '600' },
  divider: { marginVertical: 12 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoContent: { marginLeft: 16, flex: 1 },
  label: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  value: { fontSize: 16, color: colors.text, fontWeight: '500' },
  input: { marginBottom: 16, backgroundColor: colors.surface },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  button: { flex: 1 },
  logoutButton: { marginTop: 8 },
  infoCard: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: colors.surface,
  },
  infoTitle: { fontWeight: '600', marginBottom: 8 },
  infoText: { color: colors.textSecondary, marginBottom: 4, lineHeight: 20 },
});

export default ProfileEditScreen;
