import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../src/constants/theme';
import { 
  PRODUTOS_MOCK, 
  CATEGORIAS_MOCK, 
  getProdutosComEstoqueBaixo, 
  getValorTotalEstoque, 
  formatarPreco 
} from '../../src/data/mockData';
import { ProdutoCard } from '../../src/components/ProdutoCard';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const produtosComBaixoEstoque = getProdutosComEstoqueBaixo();
  
  const metricas = [
    { label: 'Total em produtos', valor: PRODUTOS_MOCK.length },
    { label: 'Categorias', valor: CATEGORIAS_MOCK.length },
    { label: 'Alertas', valor: produtosComBaixoEstoque.length },
    { label: 'Valor Estoque', valor: formatarPreco(getValorTotalEstoque()) },
  ];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Olá, Renan 👋</Text>
        <Text style={styles.subtitle}>Visão geral do seu estoque</Text>
      </View>

      <View style={styles.metricsGrid}>
        {metricas.map((item, index) => (
          <View key={index} style={styles.metricCard}>
            <Text style={styles.metricValue}>{item.valor}</Text>
            <Text style={styles.metricLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {produtosComBaixoEstoque.length > 0 && (
        <View style={styles.criticalContainer}>
          <Text style={styles.criticalTitle}>Atenção - Estoque Crítico</Text>
          {produtosComBaixoEstoque.slice(0, 3).map(p => (
            <Text key={p.id} style={styles.criticalItem}>
              • {p.nome} - {p.quantidade}/{p.quantidadeMinima} {p.unidade}
            </Text>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Produtos Recentes</Text>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={PRODUTOS_MOCK.slice(0, 5)}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProdutoCard produto={item} />}
      ListHeaderComponent={renderHeader}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary[600]]} />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.appBackground },
  content: { padding: Spacing[4], flexGrow: 1 },
  headerContainer: { marginBottom: Spacing[2] },
  header: { marginBottom: Spacing[6] },
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing[6],
  },
  metricCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    padding: Spacing[4],
    borderRadius: Radius.md,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderColor: Colors.border,
    marginBottom: Spacing[4],
  },
  metricValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[600],
    marginBottom: Spacing[1],
  },
  metricLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  criticalContainer: {
    backgroundColor: Colors.danger.bg,
    borderColor: Colors.danger.border,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderRadius: Radius.md,
    padding: Spacing[4],
    marginBottom: Spacing[6],
  },
  criticalTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.danger.text,
    marginBottom: Spacing[2],
  },
  criticalItem: {
    fontSize: Typography.fontSize.sm,
    color: Colors.danger.text,
    marginBottom: Spacing[1],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing[4],
  },
});
