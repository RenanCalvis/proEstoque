import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  isLoading?: boolean;
  iconName?: keyof typeof Feather.glyphMap;
}

export function Button({ 
  title, 
  variant = 'primary', 
  fullWidth, 
  isLoading, 
  style, 
  disabled, 
  iconName,
  ...rest 
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';

  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        isPrimary && styles.primary,
        isSecondary && styles.secondary,
        isOutline && styles.outline,
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={isOutline ? Colors.secondary[600] : Colors.white} />
      ) : (
        <>
          {iconName && (
            <Feather 
              name={iconName} 
              size={20} 
              color={isOutline ? Colors.secondary[600] : Colors.white} 
              style={title ? { marginRight: Spacing[2] } : undefined } 
            />
          )}
          {title ? (
            <Text style={[
              styles.title,
              (isPrimary || isSecondary) && styles.titleWhite,
              isOutline && styles.titleOutline,
            ]}>
              {title}
            </Text>
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: Spacing[6],
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: Colors.primary[500],
    borderBottomWidth: 4,
    borderColor: Colors.primary[700],
  },
  secondary: {
    backgroundColor: Colors.secondary[500],
    borderBottomWidth: 4,
    borderColor: Colors.secondary[700],
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.border,
  },
  disabled: {
    opacity: 0.6,
  },
  title: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
  },
  titleWhite: {
    color: Colors.white,
  },
  titleOutline: {
    color: Colors.secondary[600],
  },
});
