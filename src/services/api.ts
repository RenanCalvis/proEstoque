import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const baseURL = Platform.OS === 'android' ? 'http://10.0.2.2:3333/api' : 'http://localhost:3333/api';

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@ProEstoque:token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const originalConfig = error.config;
      if (!originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const refreshToken = await AsyncStorage.getItem('@ProEstoque:refreshToken');
          if (refreshToken) {
            const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
            await AsyncStorage.setItem('@ProEstoque:token', data.token);
            await AsyncStorage.setItem('@ProEstoque:refreshToken', data.refreshToken);
            
            originalConfig.headers.Authorization = `Bearer ${data.token}`;
            return axios(originalConfig);
          }
        } catch (refreshError) {
          await AsyncStorage.removeItem('@ProEstoque:token');
          await AsyncStorage.removeItem('@ProEstoque:refreshToken');
        }
      }
    }
    return Promise.reject(error);
  }
);
