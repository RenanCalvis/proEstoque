import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Produto } from '../data/mockData';

// Configuração de como as notificações aparecem quando o app está aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function solicitarPermissao(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('estoque-critico', {
      name: 'Estoque Crítico',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

async function agendarNotificacaoDiariaEstoque(produtosCriticos: Produto[]) {
  // Cancela notificações de estoque antigas antes de reagendar
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (produtosCriticos.length === 0) return;

  const nomes = produtosCriticos
    .slice(0, 3)
    .map((p) => p.nome)
    .join(', ');
  const resto = produtosCriticos.length > 3 ? ` e mais ${produtosCriticos.length - 3}...` : '';

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⚠️ Estoque Crítico no ProEstoque',
      body: `${produtosCriticos.length} produto(s) com estoque baixo: ${nomes}${resto}`,
      data: { screen: 'produtos' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 0,
    },
  });
}

export function useEstoqueNotifications(produtos: Produto[]) {
  useEffect(() => {
    const inicializar = async () => {
      const temPermissao = await solicitarPermissao();
      if (!temPermissao) return;

      const criticos = produtos.filter(
        (p) => p.quantidade <= p.quantidadeMinima && p.quantidade >= 0
      );

      // Agenda notificação diária às 9h
      await agendarNotificacaoDiariaEstoque(criticos);

      // Dispara uma notificação imediata para demonstrar (apenas se há itens críticos)
      if (criticos.length > 0) {
        const nomes = criticos
          .slice(0, 2)
          .map((p) => p.nome)
          .join(', ');
        const resto = criticos.length > 2 ? ` e mais ${criticos.length - 2}...` : '';

        await Notifications.scheduleNotificationAsync({
          content: {
            title: '⚠️ Estoque Crítico — ProEstoque',
            body: `${criticos.length} produto(s) com estoque baixo: ${nomes}${resto}`,
            data: { screen: 'produtos' },
          },
          trigger: null, // imediata
        });
      }
    };

    if (produtos.length > 0) {
      inicializar();
    }
  }, [produtos]);
}

export async function enviarNotificacaoImediata(produto: Produto) {
  const permissao = await solicitarPermissao();
  if (!permissao) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📦 Produto atualizado',
      body: `"${produto.nome}" foi atualizado no estoque.`,
    },
    trigger: null, // imediata
  });
}
