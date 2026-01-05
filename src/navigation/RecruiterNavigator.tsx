import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';

// Recruiter Screens (placeholders - to be implemented)
import RecruiterHomeScreen from '../screens/recruiter/RecruiterHomeScreen';
import CompanyProfileScreen from '../screens/recruiter/CompanyProfileScreen';
import PostJobScreen from '../screens/recruiter/PostJobScreen';
import MyJobsScreen from '../screens/recruiter/MyJobsScreen';

const Tab = createBottomTabNavigator();

const RecruiterNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = 'home';
                    if (route.name === 'Home') iconName = 'home';
                    else if (route.name === 'Jobs') iconName = 'briefcase';
                    else if (route.name === 'Applications') iconName = 'file-document-multiple';
                    else if (route.name === 'Profile') iconName = 'office-building';

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
            })}>
            <Tab.Screen name="Home" component={RecruiterHomeScreen} />
            <Tab.Screen name="Jobs" component={MyJobsScreen} options={{ title: 'My Jobs' }} />
            <Tab.Screen name="PostJob" component={PostJobScreen} options={{ title: 'Post Job' }} />
            <Tab.Screen name="Profile" component={CompanyProfileScreen} options={{ title: 'Company' }} />
        </Tab.Navigator>
    );
};

export default RecruiterNavigator;
