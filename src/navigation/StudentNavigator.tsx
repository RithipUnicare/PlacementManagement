import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';

// Student Screens
import StudentHomeScreen from '../screens/student/StudentHomeScreen';
import StudentProfileScreen from '../screens/student/StudentProfileScreen';
import JobsListScreen from '../screens/student/JobsListScreen';
import JobDetailsScreen from '../screens/student/JobDetailsScreen';
import MyApplicationsScreen from '../screens/student/MyApplicationsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const JobsStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="JobsList" component={JobsListScreen} options={{ title: 'Available Jobs' }} />
        <Stack.Screen name="JobDetails" component={JobDetailsScreen} options={{ title: 'Job Details' }} />
    </Stack.Navigator>
);

const StudentNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = 'home';
                    if (route.name === 'Home') iconName = 'home';
                    else if (route.name === 'Jobs') iconName = 'briefcase';
                    else if (route.name === 'Applications') iconName = 'file-document';
                    else if (route.name === 'Profile') iconName = 'account';

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
            })}>
            <Tab.Screen name="Home" component={StudentHomeScreen} />
            <Tab.Screen name="Jobs" component={JobsStack} options={{ headerShown: false }} />
            <Tab.Screen name="Applications" component={MyApplicationsScreen} />
            <Tab.Screen name="Profile" component={StudentProfileScreen} />
        </Tab.Navigator>
    );
};

export default StudentNavigator;
