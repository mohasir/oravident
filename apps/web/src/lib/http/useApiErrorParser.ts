import { useTranslation } from 'react-i18next';
import { ApiError } from './ApiError';

export function useApiErrorParser() {
  const { t: tApi } = useTranslation('api');

  return (error: unknown, callback: (message: string) => void) => {
    const err = error instanceof ApiError ? error : ApiError.from(error);
    const generic = tApi('errors.generic');
    callback(err.errorCode ? tApi(`errors.${err.errorCode}`, generic) : generic);
  };
}
