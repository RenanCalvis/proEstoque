import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  // TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { Colors, Spacing, Typography } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { LogoProEstoque } from '../../src/components/LogoProEstoque';

type FormFields = { email: string };

export default function RecuperarSenhaScreen() {
  const router = useRouter();
  const [form, setForm] = useState<FormFields>({ email: '' });
  const [errors, setErrors] = useState<Partial<FormFields>>({});
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const updateField = (field: keyof FormFields, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleRecover = () => {
    if (!form.email) {
      setErrors({ email: 'E-mail é obrigatório' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity> */}

          {isSent ? (
            <View style={styles.stateContainer}>
              <Feather
                name="mail"
                size={64}
                color={Colors.success.text}
                style={styles.icon}
              />
              <Text style={[styles.title, { color: Colors.success.text }]}>
                E-mail enviado!
              </Text>
              <Text style={styles.subtitle}>Verifique sua caixa de entrada</Text>
            </View>
          ) : (
            <View style={styles.stateContainer}>
              <View style={styles.header}>
                <LogoProEstoque />
                <Text style={styles.title}>Recuperar senha</Text>
                <Text style={styles.subtitle}>
                  Informe seu e-mail e enviaremos um link
                </Text>
              </View>

              <View style={styles.formContainer}>
                <Text style={styles.label}>E-mail de recuperação</Text>
                <Input
                  iconName="mail"
                  placeholder="Seu e-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(text) => updateField('email', text)}
                  error={errors.email}
                />

                <Button
                  title="Enviar"
                  onPress={handleRecover}
                  isLoading={loading}
                  fullWidth
                  style={styles.submitButton}
                />
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <Button
              title="Voltar ao Login"
              variant="outline"
              fullWidth
              onPress={() => router.back()}
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
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[8],
    justifyContent: 'space-between',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: Spacing[8],
  },
  backButtonText: {
    color: Colors.secondary[600],
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.base,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing[8],
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    marginBottom: Spacing[4],
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
  },
  footer: {
    marginTop: Spacing[10],
  },
});
