import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../../src/components/Button';
import { Input } from '../../../src/components/Input';
import { ImagePickerField } from '../../../src/components/ImagePickerField';
import { Colors, Spacing, Radius, Typography } from '../../../src/constants/theme';
import { useProducts } from '../../../src/contexts/ProductsContext';
import { produtoSchema, ProdutoFormData } from '../../../src/schemas/produtoSchema';
import { useCategorias } from '../../../src/hooks/useCategorias';

const formatarMoedaInput = (valor: number | undefined | null) => {
  if (valor === undefined || valor === null) return 'R$ 0,00';
  const centavos = Math.round(valor * 100);
  const reais = Math.floor(centavos / 100);
  const restCentavos = centavos % 100;
  const centavosStr = String(restCentavos).padStart(2, '0');
  const reaisStr = String(reais).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${reaisStr},${centavosStr}`;
};

export default function EditarProdutoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, atualizarProduto: editarProduto, deletarProduto } = useProducts();
  const { categorias } = useCategorias();

  const product = products.find((p) => p.id === id);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: '',
      quantidade: 0,
      quantidadeMinima: 0,
      preco: 0,
      categoriaId: '',
      observacao: '',
      foto: '',
    },
  });

  // Pré-preenche o formulário quando o produto correspondente é encontrado
  useEffect(() => {
    if (product) {
      reset({
        nome: product.nome,
        quantidade: product.quantidade,
        quantidadeMinima: product.quantidadeMinima,
        preco: product.preco,
        categoriaId: (product as any).categoriaId || '',
        observacao: product.observacao || '',
        foto: product.foto || '',
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: ProdutoFormData) => {
    try {
      if (id) {
        await editarProduto({
          ...data,
          id,
        });
        router.back();
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja excluir este produto do estoque?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            if (id) {
              await deletarProduto(id);
              router.back();
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Feather name="alert-circle" size={48} color={Colors.textSecondary} />
          <Text style={styles.notFoundText}>Produto não encontrado</Text>
          <Button title="Voltar" onPress={() => router.back()} style={{ marginTop: Spacing[4] }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <Controller
              control={control}
              name="foto"
              render={({ field: { value } }) => (
                <ImagePickerField
                  value={value}
                  onChange={(uri) => setValue('foto', uri || '', { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
                  error={errors.foto?.message}
                />
              )}
            />

            <Text style={styles.label}>Nome do Produto</Text>
            <Controller
              control={control}
              name="nome"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  iconName="package"
                  placeholder="Ex: Teclado Mecânico"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.nome?.message}
                />
              )}
            />

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Quantidade</Text>
                <Controller
                  control={control}
                  name="quantidade"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      iconName="archive"
                      placeholder="0"
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        if (text === '') {
                          onChange(undefined);
                        } else {
                          const parsed = parseInt(text.replace(/[^0-9]/g, ''), 10);
                          onChange(isNaN(parsed) ? undefined : parsed);
                        }
                      }}
                      value={value !== undefined && value !== null ? String(value) : ''}
                      error={errors.quantidade?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Mínimo Desejável</Text>
                <Controller
                  control={control}
                  name="quantidadeMinima"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      iconName="alert-triangle"
                      placeholder="0"
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        if (text === '') {
                          onChange(undefined);
                        } else {
                          const parsed = parseInt(text.replace(/[^0-9]/g, ''), 10);
                          onChange(isNaN(parsed) ? undefined : parsed);
                        }
                      }}
                      value={value !== undefined && value !== null ? String(value) : ''}
                      error={errors.quantidadeMinima?.message}
                    />
                  )}
                />
              </View>
            </View>

            <Text style={styles.label}>Categoria</Text>
            <Controller
              control={control}
              name="categoriaId"
              render={({ field: { onChange, value } }) => (
                <View style={styles.categoriesContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
                    {categorias.map((cat) => {
                      const isAtivo = value === cat.id;
                      return (
                        <TouchableOpacity
                          key={cat.id}
                          style={[styles.chip, isAtivo && styles.chipActive]}
                          onPress={() => onChange(cat.id)}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.chipText, isAtivo && styles.chipTextActive]}>
                            {cat.nome}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                  {errors.categoriaId && (
                    <Text style={styles.errorText}>{errors.categoriaId.message}</Text>
                  )}
                </View>
              )}
            />

            <Text style={styles.label}>Preço</Text>
            <Controller
              control={control}
              name="preco"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  iconName="dollar-sign"
                  placeholder="R$ 0,00"
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    const digits = text.replace(/[^0-9]/g, '');
                    if (digits === '') {
                      onChange(0);
                    } else {
                      const numericValue = parseInt(digits, 10) / 100;
                      onChange(numericValue);
                    }
                  }}
                  value={formatarMoedaInput(value)}
                  error={errors.preco?.message}
                />
              )}
            />

            <Text style={styles.label}>Observações (Opcional)</Text>
            <Controller
              control={control}
              name="observacao"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  iconName="edit-3"
                  placeholder="Adicione notas ou observações"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.observacao?.message}
                />
              )}
            />

            <Button
              title="Salvar Alterações"
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              disabled={isSubmitting}
              fullWidth
              style={styles.button}
            />

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              activeOpacity={0.8}
            >
              <Feather name="trash-2" size={20} color={Colors.danger.text} style={{ marginRight: Spacing[2] }} />
              <Text style={styles.deleteButtonText}>Excluir Produto</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.appBackground,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing[4],
    flexGrow: 1,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing[4],
  },
  col: {
    flex: 1,
  },
  categoriesContainer: {
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
  errorText: {
    color: Colors.danger.text,
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing[1],
  },
  button: {
    marginTop: Spacing[6],
    marginBottom: Spacing[2],
  },
  deleteButton: {
    borderRadius: Radius.lg,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: Spacing[6],
    backgroundColor: Colors.danger.bg,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: Colors.danger.border,
    marginTop: Spacing[4],
    marginBottom: Spacing[6],
  },
  deleteButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.danger.text,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[6],
  },
  notFoundText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing[4],
  },
});
