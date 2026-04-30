import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../src/components/Input';
import { ProdutoCard } from '../../src/components/ProdutoCard';
import { Colors, Radius, Spacing, Typography } from '../../src/constants/theme';
import { CATEGORIAS_MOCK, PRODUTOS_MOCK } from '../../src/data/mockData';

export default function ProdutosScreen() {
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'grouped'>('list');

  const categorias = [
    { id: 'todos', nome: 'Todos', icone: '', cor: '' },
    ...CATEGORIAS_MOCK,
  ];

  const produtosFiltrados = useMemo(() => {
    return PRODUTOS_MOCK.filter((p) => {
      const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
      const matchCat =
        categoriaAtiva === 'todos' || p.categoriaId === categoriaAtiva;
      return matchBusca && matchCat;
    });
  }, [busca, categoriaAtiva]);

  const secoesFiltradas = useMemo(() => {
    if (viewMode !== 'grouped') return [];

    return CATEGORIAS_MOCK.map((cat) => {
      const prods = produtosFiltrados.filter((p) => p.categoriaId === cat.id);
      return {
        id: cat.id,
        title: cat.nome,
        data: prods,
      };
    }).filter((sec) => sec.data.length > 0);
  }, [produtosFiltrados, viewMode]);

  const renderHeader = () => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.header}>
        <View style={styles.viewModeContainer}>
        <View style={styles.viewModeToggles}>
          <TouchableOpacity
            onPress={() => setViewMode('list')}
            style={[
              styles.viewModeBtn,
              viewMode === 'list' && styles.viewModeBtnActive,
            ]}
          >
            <Feather
              name="list"
              size={20}
              color={
                viewMode === 'list' ? Colors.primary[600] : Colors.textSecondary
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode('grid')}
            style={[
              styles.viewModeBtn,
              viewMode === 'grid' && styles.viewModeBtnActive,
            ]}
          >
            <Feather
              name="grid"
              size={20}
              color={
                viewMode === 'grid' ? Colors.primary[600] : Colors.textSecondary
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode('grouped')}
            style={[
              styles.viewModeBtn,
              viewMode === 'grouped' && styles.viewModeBtnActive,
            ]}
          >
            <Feather
              name="layers"
              size={20}
              color={
                viewMode === 'grouped'
                  ? Colors.primary[600]
                  : Colors.textSecondary
              }
            />
          </TouchableOpacity>
        </View>
      </View>
      <Input
        iconName="search"
        placeholder="Buscar produtos..."
        value={busca}
        onChangeText={setBusca}
      />

      <View style={styles.controlsRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
          keyboardShouldPersistTaps="handled"
        >
          {categorias.map((cat) => {
            const isAtivo = categoriaAtiva === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, isAtivo && styles.chipActive]}
                onPress={() => setCategoriaAtiva(cat.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.chipText, isAtivo && styles.chipTextActive]}
                >
                  {cat.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
    </TouchableWithoutFeedback>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      {renderHeader()}
      {viewMode === 'grouped' ? (
        <SectionList
          style={styles.container}
          contentContainerStyle={styles.content}
          sections={secoesFiltradas}
          keyExtractor={(item) => item.id}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => <ProdutoCard produto={item} />}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionCountBadge}>
                <Text style={styles.sectionCountText}>
                  {section.data.length}
                </Text>
              </View>
            </View>
          )}
          stickySectionHeadersEnabled={true}
          ListEmptyComponent={renderEmpty}
        />
      ) : (
        <FlatList
          key={viewMode}
          style={styles.container}
          contentContainerStyle={styles.content}
          data={produtosFiltrados}
          keyExtractor={(item) => item.id}
          keyboardDismissMode="on-drag"
          // keyboardShouldPersistTaps="handled"
          numColumns={viewMode === 'grid' ? 2 : 1}
          renderItem={({ item }) => (
            <ProdutoCard produto={item} isGrid={viewMode === 'grid'} />
          )}
          ListEmptyComponent={renderEmpty}
          columnWrapperStyle={
            viewMode === 'grid' ? styles.columnWrapper : undefined
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.appBackground },
  container: { flex: 1 },
  content: { padding: Spacing[4], flexGrow: 1 },
  header: { 
    marginBottom: Spacing[2], 
    paddingHorizontal: Spacing[4], 
    paddingTop: Spacing[4] 
  },
  controlsRow: {
    marginBottom: Spacing[4],
  },
  categoriesScroll: {
    paddingVertical: Spacing[1],
  },
  chip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderColor: Colors.border,
    marginRight: Spacing[2],
  },
  chipActive: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[700],
  },
  chipText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
  },
  viewModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  viewModeLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  viewModeToggles: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderColor: Colors.border,
    padding: 2,
  },
  viewModeBtn: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.md,
  },
  viewModeBtnActive: {
    backgroundColor: Colors.primary[50],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.appBackground,
    paddingVertical: Spacing[2],
    marginBottom: Spacing[2],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginRight: Spacing[2],
  },
  sectionCountBadge: {
    backgroundColor: Colors.primary[600],
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  sectionCountText: {
    color: Colors.white,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginHorizontal: Spacing[4],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing[10],
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.base,
  },
});
