import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing, Typography } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';

export default function ConfiguracoesScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Sair', 
        style: 'destructive',
        onPress: () => router.replace('/(auth)/login') 
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conta</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Usuário</Text>
          <Text style={styles.infoValue}>Administrador</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>E-mail</Text>
          <Text style={styles.infoValue}>admin@proestoque.com</Text>
        </View>
      </View>

      <Button 
        title="Sair da Conta" 
        variant="outline" 
        iconName="log-out"
        onPress={handleLogout} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground,
    padding: Spacing[4],
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing[4],
    marginBottom: Spacing[6],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing[2],
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing[2],
  },
  infoLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.base,
  },
  infoValue: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  logoutButton: {
    borderColor: Colors.danger.border,
  },
});
