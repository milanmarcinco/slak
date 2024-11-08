import type { AxiosError, AxiosRequestConfig } from 'axios';

import { api } from 'lib/axios';
import { ApiToken, LoginData, RegisterData, User } from 'src/contracts';

class AuthService {
  async me(dontTriggerLogout = false): Promise<User | null> {
    return api
      .get('auth/me', { dontTriggerLogout } as AxiosRequestConfig)
      .then((response) => response.data)
      .catch((error: AxiosError) => {
        if (error.response?.status === 401) {
          return null;
        }

        return Promise.reject(error);
      });
  }

  async register(data: RegisterData): Promise<ApiToken> {
    const response = await api.post<ApiToken>('/auth/register', data);
    return response.data;
  }

  async login(data: LoginData): Promise<ApiToken> {
    const response = await api.post<ApiToken>('/auth/login', data);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }
}

export default new AuthService();
