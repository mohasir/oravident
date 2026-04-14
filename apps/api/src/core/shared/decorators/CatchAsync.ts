/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@/core/errors/helpers/asyncHandler.ts';

type ControllerMethod = (req: Request, res: Response, next: NextFunction) => any;

type GConstructor<T = object> = new (...args: any[]) => T;

export function CatchAsync<T extends GConstructor>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      
      const prototype = constructor.prototype;
      const propertyNames = Object.getOwnPropertyNames(prototype);

      for (const propertyName of propertyNames) {
        if (propertyName === 'constructor') continue;

        const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);

        const isMethodController = descriptor && typeof descriptor.value === 'function';
        
        if (isMethodController) {
          const originalMethod = descriptor.value as ControllerMethod;
          
          (this as any)[propertyName] = asyncHandler(originalMethod.bind(this));
        }
      }
    }
  };
}
