import { ServiceSelect } from '@core/db/schema/services.ts';

export type Select = ServiceSelect;

export const serviceResource = (service: Select) => {
  return {
    id: service.id,
    name: service.name,
    description: service.description,
    durationMinutes: service.durationMinutes,
    price: service.price,
    isActive: service.isActive,
    updatedAt: service.updatedAt,
    createdAt: service.createdAt,
  };
};

export const serviceCollectionResource = (services: Select[]) => {
  return services.map(serviceResource);
};
