import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../src/constants/theme';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Olá, Renan 👋</Text>
        <Text style={styles.subtitle}>Visão geral do seu estoque</Text>
      </View>

      <View style={[styles.card, styles.primaryCard]}>
        <Text style={styles.primaryCardText}>Total em produtos: 247</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.subCard}>
          <Text style={styles.subCardTitle}>Categorias: 12</Text>
        </View>

        <View style={styles.subCard}>
          <Text style={styles.subCardTitle}>
            Alertas: <Text style={styles.alertText}>5</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.appBackground },
  content: { padding: Spacing[6] },
  header: { marginBottom: Spacing[8] },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginTop: Spacing[1],
  },
  card: {
    borderRadius: Radius.lg,
    padding: Spacing[6],
    marginBottom: Spacing[4],
    justifyContent: 'center',
  },
  primaryCard: {
    backgroundColor: Colors.primary[600],
  },
  primaryCardText: {
    color: Colors.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing[10],
  },
  subCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing[5],
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing[1],
    alignItems: 'center',
    justifyContent: 'center',
  },
  subCardTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  alertText: {
    color: Colors.danger.text,
  },
  footerText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: Spacing[6],
  },
});
