import { Request } from 'express';

/**
 * Generic Request with 'id' path parameter
 */
export interface IdParamRequest extends Request {
  params: {
    id: string;
  };
}
