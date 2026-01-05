import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, Card} from 'react-native-paper';
import {useAuth} from '../../context/AuthContext';
import {colors} from '../../theme/colors';

const StudentHomeScreen = () => {
  const {user} = useAuth();
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Welcome, {user?.name}!</Text>
        <Text style={styles.subtitle}>Student Dashboard</Text>
      </View>
      <Card style={styles.card}><Card.Content><Text>Dashboard content - to be implemented</Text></Card.Content></Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  header: {padding: 16},
  subtitle: {color: colors.textSecondary, marginTop: 4},
  card: {margin: 16},
});

export default StudentHomeScreen;
