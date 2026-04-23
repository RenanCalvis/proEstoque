import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../constants/theme';

interface LogoProps {
  size?: 'small' | 'large';
}

export function LogoProEstoque({ size = 'large' }: LogoProps) {
  const isLarge = size === 'large';
  
  return (
    <View style={styles.container}>
      <Feather 
        name="box" 
        size={isLarge ? 48 : 32} 
        color={Colors.primary[600]} 
        style={styles.icon}
      />
      <Text style={[styles.text, isLarge ? styles.textLarge : styles.textSmall]}>
        ProEstoque
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: Spacing[2],
  },
  text: {
    fontWeight: Typography.fontWeight.black,
    color: Colors.primary[600],
  },
  textLarge: {
    fontSize: Typography.fontSize['3xl'],
  },
  textSmall: {
    fontSize: Typography.fontSize['2xl'],
  },
});
