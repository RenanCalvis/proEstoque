import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

interface InputProps extends TextInputProps {
  iconName?: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
  error?: string;
}

export function Input({
  iconName,
  isPassword,
  error,
  style,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={[styles.container]}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
        ]}
      >
        {iconName && (
          <Feather
            name={iconName}
            size={20}
            color={
              error
                ? Colors.danger.border
                : isFocused
                ? Colors.secondary[500]
                : Colors.textSecondary
            }
            style={styles.iconStyles}
          />
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.textSecondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={0.7}
          >
            <Feather
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing[4],
  },
  inputContainer: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: Spacing[4],
  },
  inputFocused: {
    borderColor: Colors.secondary[500],
  },
  inputError: {
    borderColor: Colors.danger.border,
  },
  iconStyles: {
    marginRight: Spacing[2],
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    color: Colors.textPrimary,
    height: '100%',
  },
  eyeIcon: {
    marginLeft: Spacing[2],
  },
  errorText: {
    marginTop: Spacing[1],
    fontSize: Typography.fontSize.sm,
    color: Colors.danger.text,
    fontWeight: Typography.fontWeight.semibold,
  },
});
