import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import { Colors, Spacing, Typography } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { LogoProEstoque } from '../../src/components/LogoProEstoque';
import { useAuth } from '../../src/contexts/AuthContext';

type FormFields = { email: string; password: string };

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [form, setForm] = useState<FormFields>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<FormFields>>({});
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof FormFields, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogin = async () => {
    let valid = true;
    const newErrors: Partial<FormFields> = {};

    if (!form.email) {
      newErrors.email = 'E-mail é obrigatório';
      valid = false;
    }
    if (!form.password) {
      newErrors.password = 'Senha é obrigatória';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setLoading(true);
      try {
        await login({ email: form.email, senha: form.password });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <LogoProEstoque />
            <Text style={styles.title}>Bem-vindo de volta!</Text>
            <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>E-mail</Text>
            <Input
              iconName="mail"
              placeholder="user@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(text) => updateField('email', text)}
              error={errors.email}
            />

            <Text style={styles.label}>Senha</Text>
            <Input
              iconName="lock"
              placeholder="••••••••"
              isPassword
              value={form.password}
              onChangeText={(text) => updateField('password', text)}
              error={errors.password}
            />

            <View style={styles.forgotPasswordContainer}>
              <Link href="/(auth)/recuperar-senha" style={styles.linkText}>
                Esqueci minha senha
              </Link>
            </View>

            <Button
              title="Entrar"
              onPress={handleLogin}
              isLoading={isLoading || loading}
              fullWidth
              style={styles.submitButton}
            />

            <View style={styles.footer}>
              <Link href="/(auth)/cadastro" style={styles.linkText}>
                Não tem conta? Cadastrar
              </Link>
            </View>
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing[6],
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: Spacing[8],
  },
  submitButton: {
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
