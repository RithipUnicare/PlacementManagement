import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Text,
  Searchbar,
  Card,
  IconButton,
  Chip,
  Menu,
  Button,
} from 'react-native-paper';
import { colors } from '../../theme/colors';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { userService, User } from '../../services/userService';
import { authService } from '../../services/authService';

const ManageUsersScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const [roleMenuVisible, setRoleMenuVisible] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      setError(null);
      const data = await userService.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        user =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.mobileNumber.includes(searchQuery) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleDeleteUser = (user: User) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteUser(user.id),
        },
      ],
    );
  };

  const deleteUser = async (userId: number) => {
    try {
      await userService.deleteUser(userId);
      Alert.alert('Success', 'User deleted successfully');
      fetchUsers();
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Failed to delete user',
      );
    }
  };

  const handleUpdateRole = (user: User, newRole: string) => {
    Alert.alert('Update Role', `Change ${user.name}'s role to ${newRole}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Update',
        onPress: () => updateUserRole(user.mobileNumber, newRole),
      },
    ]);
  };

  const updateUserRole = async (mobileNumber: string, newRole: string) => {
    try {
      await authService.updateUserRole(mobileNumber, newRole);
      Alert.alert('Success', 'User role updated successfully');
      setRoleMenuVisible(null);
      fetchUsers();
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Failed to update role',
      );
    }
  };

  const getRoleColor = (role: string) => {
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

  const renderUserCard = ({ item }: { item: User }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium" style={styles.userName}>
              {item.name}
            </Text>
            <Text style={styles.userInfo}>{item.mobileNumber}</Text>
            {item.email && <Text style={styles.userInfo}>{item.email}</Text>}
          </View>
          <IconButton
            icon="dots-vertical"
            size={20}
            onPress={() =>
              setMenuVisible(menuVisible === item.id ? null : item.id)
            }
          />
        </View>

        <View style={styles.roleContainer}>
          <Chip
            mode="flat"
            style={[
              styles.roleChip,
              { backgroundColor: getRoleColor(item.roles) },
            ]}
            textStyle={styles.roleText}
            onPress={() =>
              setRoleMenuVisible(roleMenuVisible === item.id ? null : item.id)
            }
          >
            {item.roles}
          </Chip>

          {roleMenuVisible === item.id && (
            <View style={styles.roleMenu}>
              {['STUDENT', 'RECRUITER', 'ADMIN'].map(role => (
                <Button
                  key={role}
                  mode={item.roles === role ? 'contained' : 'outlined'}
                  onPress={() => handleUpdateRole(item, role)}
                  style={styles.roleButton}
                  compact
                >
                  {role}
                </Button>
              ))}
            </View>
          )}
        </View>

        {menuVisible === item.id && (
          <View style={styles.actionsContainer}>
            <Button
              mode="outlined"
              onPress={() => handleDeleteUser(item)}
              textColor={colors.error}
              style={styles.deleteButton}
              icon="delete"
            >
              Delete User
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchUsers} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant="titleLarge" style={styles.headerText}>
          Manage Users ({users.length})
        </Text>
        <Text style={styles.subtitle}>Search and manage user accounts</Text>
      </View>

      <Searchbar
        placeholder="Search by name, mobile, or email..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id.toString()}
        renderItem={renderUserCard}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="account-search"
            title="No Users Found"
            message={
              searchQuery
                ? 'No users match your search criteria.'
                : 'No users in the system yet.'
            }
          />
        }
        contentContainerStyle={
          filteredUsers.length === 0 ? styles.emptyContainer : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerContainer: { padding: 16, paddingBottom: 8 },
  headerText: { fontWeight: '600' },
  subtitle: { color: colors.textSecondary, marginTop: 4 },
  searchbar: { marginHorizontal: 16, marginBottom: 8 },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: colors.surface,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userName: { fontWeight: '600' },
  userInfo: { color: colors.textSecondary, marginTop: 2, fontSize: 14 },
  roleContainer: { marginTop: 8 },
  roleChip: {},
  roleText: { color: '#FFFFFF', fontWeight: '600' },
  roleMenu: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  roleButton: { flex: 1 },
  actionsContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  deleteButton: { borderColor: colors.error },
  emptyContainer: { flex: 1 },
});

export default ManageUsersScreen;
