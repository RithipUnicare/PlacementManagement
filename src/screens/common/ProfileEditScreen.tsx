import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {useAuth} from '../../context/AuthContext';
import {colors} from '../../theme/colors';

const ProfileEditScreen = () => {
  const {user, logout} = useAuth();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium">Profile</Text>
        <Text style={styles.info}>Name: {user?.name}</Text>
        <Text style={styles.info}>Mobile: {user?.mobileNumber}</Text>
        <Text style={styles.info}>Email: {user?.email || 'N/A'}</Text>
        <Text style={styles.info}>Role: {user?.roles}</Text>
        <Button mode="contained" onPress={logout} style={styles.logoutButton}>Logout</Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {padding: 16},
  info: {marginVertical: 8, fontSize: 16},
  logoutButton: {marginTop: 24},
});

export default ProfileEditScreen;
