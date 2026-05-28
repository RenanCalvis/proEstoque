import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

interface ImagePickerFieldProps {
  value?: string;
  onChange: (uri: string | null) => void;
  error?: string;
}

export function ImagePickerField({ value, onChange, error }: ImagePickerFieldProps) {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Precisamos de permissão para acessar a galeria e adicionar uma foto!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      onChange(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    onChange(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Foto do Produto</Text>
      <View style={[styles.pickerContainer, error ? styles.pickerError : null]}>
        {value ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: value }} style={styles.image} />
            <TouchableOpacity style={styles.removeButton} onPress={removeImage} activeOpacity={0.7}>
              <Feather name="trash-2" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.placeholder} onPress={pickImage} activeOpacity={0.7}>
            <Feather name="camera" size={32} color={Colors.textSecondary} />
            <Text style={styles.placeholderText}>Adicionar Foto</Text>
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
    alignItems: 'center',
  },
  label: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
    alignSelf: 'flex-start',
  },
  pickerContainer: {
    width: 140,
    height: 140,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  pickerError: {
    borderColor: Colors.danger.border,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing[2],
  },
  previewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: Radius.xl - 2,
  },
  removeButton: {
    position: 'absolute',
    top: Spacing[2],
    right: Spacing[2],
    backgroundColor: Colors.danger.text,
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorText: {
    marginTop: Spacing[1],
    fontSize: Typography.fontSize.sm,
    color: Colors.danger.text,
    fontWeight: Typography.fontWeight.semibold,
  },
});
