import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {colors} from '../../theme/colors';

const ForgotPasswordScreen = ({navigation}: any) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Forgot Password</Text>
      <Text style={styles.info}>Password reset functionality - to be implemented</Text>
      <Button mode="contained" onPress={() => navigation.navigate('Login')}>Back to Login</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.background},
  info: {marginVertical: 16, textAlign: 'center', color: colors.textSecondary},
});

export default ForgotPasswordScreen;
