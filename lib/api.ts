import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/store/authStore';

const SESSION_KEY = 'hasSession';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _skipAuthRefresh?: boolean;
};

const getBaseURL = () => {
  const isServer = typeof window === 'undefined';

  if (!isServer) {
    return '/api';
  }

  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    throw new Error('BACKEND_URL is not configured');
  }

  return `${backendUrl}/api`;
};

const clearClientSession = () => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(SESSION_KEY);
  useAuthStore.getState().clearUser();
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

if (typeof window !== 'undefined') {
  api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined;
      const status = error.response?.status;
      const requestUrl = originalRequest?.url ?? '';

      const isUnauthorized = status === 401;
      const isRefreshRequest = requestUrl.includes('/auth/refresh');
      const shouldSkipRefresh = originalRequest?._skipAuthRefresh === true;
      const alreadyRetried = originalRequest?._retry === true;

      if (
        !isUnauthorized ||
        !originalRequest ||
        alreadyRetried ||
        isRefreshRequest ||
        shouldSkipRefresh
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = api
            .post(
              '/auth/refresh',
              undefined,
              { _skipAuthRefresh: true } as RetryableRequestConfig
            )
            .then(() => undefined)
            .finally(() => {
              refreshPromise = null;
            });
        }

        await refreshPromise;
        return api(originalRequest);
      } catch (refreshError) {
        clearClientSession();
        return Promise.reject(refreshError);
      }
    }
  );
}
