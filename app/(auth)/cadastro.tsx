import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing, Typography } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { LogoProEstoque } from '../../src/components/LogoProEstoque';
import { useAuth } from '../../src/contexts/AuthContext';

type FormFields = { nome: string; email: string; senha: string; confirmarSenha: string };

export default function CadastroScreen() {
  const { registrar } = useAuth();
  const [form, setForm] = useState<FormFields>({ nome: '', email: '', senha: '', confirmarSenha: '' });
  const [errors, setErrors] = useState<Partial<FormFields>>({});
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof FormFields, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRegister = () => {
    let valid = true;
    const newErrors: Partial<FormFields> = {};

    if (!form.nome) { newErrors.nome = 'Nome é obrigatório'; valid = false; }
    if (!form.email) { newErrors.email = 'E-mail é obrigatório'; valid = false; }
    if (!form.senha) { newErrors.senha = 'Senha é obrigatória'; valid = false; }
    if (form.senha !== form.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setLoading(true);
      registrar({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
      })
      .catch((error: any) => {
        if (error.response?.status === 422) {
          const backendErrors = error.response.data.errors;
          const apiErrors: Partial<FormFields> = {};
          backendErrors.forEach((err: any) => {
            if (err.path.includes('nome')) apiErrors.nome = err.message;
            if (err.path.includes('email')) apiErrors.email = err.message;
            if (err.path.includes('senha')) apiErrors.senha = err.message;
          });
          setErrors(apiErrors);
        } else if (error.response?.data?.message) {
          Alert.alert('Erro no Cadastro', error.response.data.message);
        } else {
          Alert.alert('Erro', 'Ocorreu um erro inesperado ao cadastrar.');
        }
      })
      .finally(() => setLoading(false));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <LogoProEstoque />
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Preencha seus dados abaixo</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Nome completo</Text>
            <Input
              iconName="user"
              placeholder=""
              autoCapitalize="words"
              value={form.nome}
              onChangeText={(text) => updateField('nome', text)}
              error={errors.nome}
            />

            <Text style={styles.label}>E-mail</Text>
            <Input
              iconName="mail"
              placeholder="seu_email@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(text) => updateField('email', text)}
              error={errors.email}
            />

            <Text style={styles.label}>Senha</Text>
            <Input
              iconName="lock"
              placeholder=""
              isPassword
              value={form.senha}
              onChangeText={(text) => updateField('senha', text)}
              error={errors.senha}
            />

            <Text style={styles.label}>Confirmar senha</Text>
            <Input
              iconName="check-circle"
              placeholder=""
              isPassword
              value={form.confirmarSenha}
              onChangeText={(text) => updateField('confirmarSenha', text)}
              error={errors.confirmarSenha}
            />

            <Button
              title="Criar Conta"
              onPress={handleRegister}
              isLoading={loading}
              fullWidth
              style={styles.submitButton}
            />

            <View style={styles.footer}>
              <Link href="/(auth)/login" style={styles.linkText}>
                Já tenho conta
              </Link>
            </View>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[8],
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing[8],
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing[6],
    marginBottom: Spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  submitButton: {
    marginTop: Spacing[4],
    marginBottom: Spacing[8],
  },
  footer: {
    alignItems: 'center',
  },
  linkText: {
    color: Colors.secondary[600],
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.base,
  },
});
