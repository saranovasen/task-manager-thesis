import { httpRequest } from '../../../shared/api/httpClient';

export const logout = (token: string) => {
  return httpRequest<{ ok: true }>('/auth/logout', {
    method: 'POST',
    token,
  });
};
