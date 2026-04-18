import { ApiError, ErrorCodes } from '@/core/errors/index.ts';
import { TypedRequest } from '@common/types/requests.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateRequest = <T extends TypedRequest<any>>(req: T) => {
  return {
    get query(): NonNullable<T['validatedQuery']> {
      if (!req.validatedQuery) {
        throw new ApiError(
          'Internal validation missing for query',
          500,
          ErrorCodes.system.INTERNAL_SERVER_ERROR,
        );
      }
      return req.validatedQuery as NonNullable<T['validatedQuery']>;
    },
    get body(): NonNullable<T['validatedBody']> {
      if (!req.validatedBody) {
        throw new ApiError(
          'Internal validation missing for body',
          500,
          ErrorCodes.system.INTERNAL_SERVER_ERROR,
        );
      }
      return req.validatedBody as NonNullable<T['validatedBody']>;
    },
    get params(): NonNullable<T['validatedParams']> {
      if (!req.validatedParams) {
        throw new ApiError(
          'Internal validation missing for params',
          500,
          ErrorCodes.system.INTERNAL_SERVER_ERROR,
        );
      }
      return req.validatedParams as NonNullable<T['validatedParams']>;
    },
  };
};
