import axios, { type InternalAxiosRequestConfig } from 'axios';
import { AppConfig, HeaderKeys, StorageKeys } from '@/config/constants';

const apiClient = axios.create({
  baseURL: AppConfig.baseUrl,
  timeout: 40_000,
  headers: { 'Content-Type': 'application/json; charset=UTF-8' },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(StorageKeys.token);
  const languageCode = localStorage.getItem(StorageKeys.languageCode) || 'fr';
  const moduleId = localStorage.getItem(StorageKeys.moduleId);
  const zoneIdsRaw = localStorage.getItem(StorageKeys.zoneIds);
  const addressRaw = localStorage.getItem(StorageKeys.userAddress);

  config.headers.set(HeaderKeys.localization, languageCode);
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  if (moduleId) config.headers.set(HeaderKeys.moduleId, moduleId);
  if (zoneIdsRaw) config.headers.set(HeaderKeys.zoneId, zoneIdsRaw);

  if (addressRaw) {
    try {
      const address = JSON.parse(addressRaw);
      if (address?.latitude) config.headers.set(HeaderKeys.latitude, JSON.stringify(address.latitude));
      if (address?.longitude) config.headers.set(HeaderKeys.longitude, JSON.stringify(address.longitude));
    } catch {
      /* ignored: malformed cached address, headers simply omitted */
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(StorageKeys.token);
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
