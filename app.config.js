import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      useMocks: process.env.EXPO_PUBLIC_USE_MOCKS === 'true',
    },
  };
};
