import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../src/constants/theme';
import { ProdutoCard } from '../../src/components/ProdutoCard';
import { useAuth } from '../../src/contexts/AuthContext';
import { useProducts } from '../../src/contexts/ProductsContext';
import { useCategorias } from '../../src/hooks/useCategorias';
import { LoadingView } from '../../src/components/LoadingView';
import { ErrorView } from '../../src/components/ErrorView';

export default function HomeScreen() {
  const { user } = useAuth();
  const { products, isLoading, error, carregarProdutos } = useProducts();
  const { categorias } = useCategorias();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const formatarPrecoBRL = (valor: number) => {
    return `R$ ${valor.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`;
  };

  const produtosComBaixoEstoque = products.filter(
    (p) => p.quantidade <= p.quantidadeMinima
  );

  const valorTotalEstoque = products.reduce(
    (sum, p) => sum + p.quantidade * p.preco,
    0
  );
  
  const metricas = [
    { label: 'Total em produtos', valor: products.length },
    { label: 'Categorias', valor: categorias.length },
    { label: 'Alertas', valor: produtosComBaixoEstoque.length },
    { label: 'Valor Estoque', valor: formatarPrecoBRL(valorTotalEstoque) },
  ];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>{getGreeting()}, {user?.nome?.split(' ')[0] || 'Usuário'} 👋</Text>
          <Text style={styles.subtitle}>Visão geral do seu estoque</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.nome?.charAt(0).toUpperCase() || 'U'}</Text>
        </View>
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
              • {p.nome} - {p.quantidade}/{p.quantidadeMinima} {(p as any).unidade || 'un'}
            </Text>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Produtos Recentes</Text>
    </View>
  );

  if (isLoading && products.length === 0) {
    return <LoadingView />;
  }

  if (error && products.length === 0) {
    return <ErrorView message={error} onRetry={carregarProdutos} />;
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={products.slice(0, 5)}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProdutoCard produto={item as any} />}
      ListHeaderComponent={renderHeader}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={carregarProdutos} colors={[Colors.primary[600]]} />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.appBackground },
  content: { padding: Spacing[4], flexGrow: 1 },
  headerContainer: { marginBottom: Spacing[2] },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: Spacing[6] 
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.surface,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
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
