import { ServiceSelect } from '@core/db/schema/services.ts';
import { formatDate } from '@common/utils/date.ts';

export type Select = ServiceSelect;

export const serviceResource = (service: Select) => {
  return {
    id: service.id,
    name: service.name,
    description: service.description,
    durationMinutes: service.durationMinutes,
    price: service.price,
    isActive: service.isActive,
    createdAt: formatDate(service.createdAt),
    updatedAt: formatDate(service.updatedAt),
  };
};

export const serviceCollectionResource = (services: Select[]) => {
  return services.map(serviceResource);
};
