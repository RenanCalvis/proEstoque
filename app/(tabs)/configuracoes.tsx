import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { useAuth } from '../../src/contexts/AuthContext';

export default function ConfiguracoesScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Sair', 
        style: 'destructive',
        onPress: () => logout() 
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.nome?.charAt(0).toUpperCase() || 'U'}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.nome || 'Usuário'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'email@exemplo.com'}</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={styles.menuItemLeft}>
            <Feather name="bell" size={22} color={Colors.textPrimary} />
            <Text style={styles.menuItemText}>Notificações</Text>
          </View>
          <Feather name="chevron-right" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={styles.menuItemLeft}>
            <Feather name="help-circle" size={22} color={Colors.textPrimary} />
            <Text style={styles.menuItemText}>Ajuda e Suporte</Text>
          </View>
          <Feather name="chevron-right" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Button 
        title="Sair da Conta" 
        variant="outline" 
        iconName="log-out"
        onPress={handleLogout} 
        style={styles.logoutButton}
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
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderColor: Colors.border,
    padding: Spacing[6],
    marginBottom: Spacing[6],
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing[4],
  },
  avatarText: {
    color: Colors.surface,
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing[1],
  },
  profileEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  menuSection: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderColor: Colors.border,
    marginBottom: Spacing[8],
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: Spacing[4],
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: Spacing[4],
  },
});
