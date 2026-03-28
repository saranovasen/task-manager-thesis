import { httpRequest } from '../../../shared/api/httpClient';
import type { LoginResponse, RegisterPayload } from '../model/types';

export const register = (payload: RegisterPayload) => {
  return httpRequest<LoginResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  });
};
