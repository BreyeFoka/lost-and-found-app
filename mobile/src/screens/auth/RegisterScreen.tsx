import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RegisterScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Register Screen</Text>
      <Text style={styles.subText}>Coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  subText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
  },
});

export default RegisterScreen;
