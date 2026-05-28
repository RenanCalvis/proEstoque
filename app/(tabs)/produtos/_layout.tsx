import { Stack } from 'expo-router';

export default function ProdutosLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="novo"
        options={{
          presentation: 'modal',
          title: 'Novo Produto',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          presentation: 'modal',
          title: 'Editar Produto',
        }}
      />
    </Stack>
  );
}
