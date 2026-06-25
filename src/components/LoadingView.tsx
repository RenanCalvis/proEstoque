import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Colors } from '../constants/theme';

export function LoadingView() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary.main} />
      <Text style={styles.text}>Carregando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.main,
  },
  text: {
    marginTop: 16,
    color: Colors.text.secondary,
  },
});
