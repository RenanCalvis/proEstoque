import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';
import { Produto } from '../data/mockData';

export function ProdutoCard({ produto, isGrid = false }: { produto: Produto, isGrid?: boolean }) {
  let badgeColor = Colors.success;
  let badgeText = 'Normal';

  if (produto.quantidade === 0) {
    badgeColor = Colors.danger;
    badgeText = 'Sem estoque';
  } else if (produto.quantidade <= produto.quantidadeMinima) {
    badgeColor = Colors.warning;
    badgeText = 'Baixo';
  }

  return (
    <View style={[styles.card, isGrid && styles.cardGrid]}>
      <View style={[styles.infoContainer, isGrid && styles.infoContainerGrid]}>
        <Text style={[styles.name, isGrid && styles.nameGrid]} numberOfLines={isGrid ? 2 : 1}>
          {produto.nome}
        </Text>
        <Text style={styles.qty}>{produto.quantidade} {produto.unidade}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: badgeColor.bg, borderColor: badgeColor.border }, isGrid && styles.badgeGrid]}>
        <Text style={[styles.badgeText, { color: badgeColor.text }]}>{badgeText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing[4],
    marginBottom: Spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardGrid: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginHorizontal: Spacing[2],
    justifyContent: 'flex-start',
  },
  infoContainer: {
    flex: 1,
    marginRight: Spacing[2],
  },
  infoContainerGrid: {
    marginRight: 0,
    marginBottom: Spacing[3],
    width: '100%',
  },
  name: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  nameGrid: {
    fontSize: Typography.fontSize.sm,
    minHeight: 40,
  },
  qty: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing[1],
  },
  badge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  badgeGrid: {
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
});
