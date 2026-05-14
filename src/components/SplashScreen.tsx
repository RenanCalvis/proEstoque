import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LogoProEstoque } from './LogoProEstoque';
import { Colors, Radius, Spacing } from '../constants/theme';

export function SplashScreen() {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 1500, 
      useNativeDriver: false, 
    }).start();
  }, [progressAnim]);

  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <LogoProEstoque size="large" />
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, { width: widthInterpolated }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.appBackground,
  },
  progressContainer: {
    width: '60%',
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    marginTop: Spacing[10],
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary[600],
    borderRadius: Radius.full,
  },
});
