import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../../src/components/Button';
import { Input } from '../../../src/components/Input';
import { Colors, Spacing, Typography } from '../../../src/constants/theme';
import { useProducts } from '../../../src/contexts/ProductsContext';
import { produtoSchema, ProdutoFormData } from '../../../src/schemas/produtoSchema';

const formatarMoedaInput = (valor: number | undefined | null) => {
  if (valor === undefined || valor === null) return 'R$ 0,00';
  const centavos = Math.round(valor * 100);
  const reais = Math.floor(centavos / 100);
  const restCentavos = centavos % 100;
  const centavosStr = String(restCentavos).padStart(2, '0');
  const reaisStr = String(reais).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${reaisStr},${centavosStr}`;
};

export default function NovoProdutoScreen() {
  const { adicionarProduto } = useProducts();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: '',
      quantidade: 0,
      quantidadeMinima: 0,
      preco: 0,
      observacao: '',
      foto: '',
    },
  });

  const onSubmit = async (data: ProdutoFormData) => {
    try {
      adicionarProduto(data);
      router.back();
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

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
              title="Cadastrar Produto"
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              disabled={isSubmitting}
              fullWidth
              style={styles.button}
            />
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
  button: {
    marginTop: Spacing[6],
    marginBottom: Spacing[4],
  },
});
