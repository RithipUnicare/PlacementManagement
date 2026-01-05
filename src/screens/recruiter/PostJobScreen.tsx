import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {colors} from '../../theme/colors';

const PostJobScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">PostJobScreen</Text>
      <Text>To be implemented</Text>
    </View>
  );
};

const styles = StyleSheet.create({container: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background}});
export default PostJobScreen;
