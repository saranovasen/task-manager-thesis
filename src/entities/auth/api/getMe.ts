import { httpRequest } from '../../../shared/api/httpClient';
import type { AuthUser } from '../model/types';

export const getMe = (token: string) => {
  return httpRequest<AuthUser>('/auth/me', {
    method: 'GET',
    token,
  });
};
