import { Request } from 'express';
import z from 'zod';
import { createIdParamSchema } from '@common/schemas/common.schema.ts';

export interface RequestValidationSchema {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
}

export type InferBody<T extends RequestValidationSchema> =
  T['body'] extends z.ZodTypeAny ? z.infer<T['body']> : never;

export type InferQuery<T extends RequestValidationSchema> =
  T['query'] extends z.ZodTypeAny ? z.infer<T['query']> : never;

export type InferParams<T extends RequestValidationSchema> =
  T['params'] extends z.ZodTypeAny ? z.infer<T['params']> : never;

export type TypedRequest<T extends RequestValidationSchema> = Request & {
  validatedBody?: InferBody<T>;
  validatedQuery?: InferQuery<T>;
  validatedParams?: InferParams<T>;
};

/**
 * Generic Request with 'id' path parameter
 */

export const commonIdParamSchema = {
  params: z.object({
    id: createIdParamSchema('id'),
  }),
};

export const idParamRequest = {
  params: commonIdParamSchema.params,
};
export type IdParamRequest = TypedRequest<typeof idParamRequest>;
