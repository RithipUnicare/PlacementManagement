import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';

// Admin Screens (placeholders - to be implemented)
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ManageUsersScreen from '../screens/admin/ManageUsersScreen';
import PendingJobsScreen from '../screens/admin/PendingJobsScreen';
import ProfileEditScreen from '../screens/common/ProfileEditScreen';

const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = 'view-dashboard';
                    if (route.name === 'Dashboard') iconName = 'view-dashboard';
                    else if (route.name === 'Users') iconName = 'account-group';
                    else if (route.name === 'Jobs') iconName = 'briefcase-check';
                    else if (route.name === 'Profile') iconName = 'account';

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
            })}>
            <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
            <Tab.Screen name="Users" component={ManageUsersScreen} options={{ title: 'Manage Users' }} />
            <Tab.Screen name="Jobs" component={PendingJobsScreen} options={{ title: 'Approve Jobs' }} />
            <Tab.Screen name="Profile" component={ProfileEditScreen} />
        </Tab.Navigator>
    );
};

export default AdminNavigator;
