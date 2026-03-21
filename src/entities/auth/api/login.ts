import { httpRequest } from '../../../shared/api/httpClient';
import type { LoginPayload, LoginResponse } from '../model/types';

export const login = (payload: LoginPayload) => {
  return httpRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
};
