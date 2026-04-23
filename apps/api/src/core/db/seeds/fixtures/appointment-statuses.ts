export const APPOINTMENT_STATUS_IDS = {
  PENDIENTE: 'C0828068-B5A9-41D5-8366-8F1A337259E2',
  CONFIRMADA: '98F85ABC-E7D2-42BD-A2D3-4C2A4A9E48B5',
  REAGENDADA: 'BC9D907E-9EB0-4CAD-8B10-FFBBB0743510',
  CANCELADA: '08E17C50-5466-4C09-AC82-D02A951C84D9',
  COMPLETADA: '957EBA01-5D30-4BA8-B509-2FFE4E219BD8',
  NO_ASISTIO: 'F383CD13-D95C-4C07-AECD-D27BD7B9C561',
} as const;

export const APPOINTMENT_STATUSES_DATA = [
  {
    id: APPOINTMENT_STATUS_IDS.PENDIENTE,
    name: 'Pendiente',
    color: '#FF9800',
    bgColor: '#FFF3E0',
  },
  {
    id: APPOINTMENT_STATUS_IDS.CONFIRMADA,
    name: 'Confirmada',
    color: '#4CAF50',
    bgColor: '#E8F5E9',
  },
  {
    id: APPOINTMENT_STATUS_IDS.REAGENDADA,
    name: 'Reagendada',
    color: '#2196F3',
    bgColor: '#E3F2FD',
  },
  {
    id: APPOINTMENT_STATUS_IDS.CANCELADA,
    name: 'Cancelada',
    color: '#F44336',
    bgColor: '#FFEBEE',
  },
  {
    id: APPOINTMENT_STATUS_IDS.COMPLETADA,
    name: 'Completada',
    color: '#9C27B0',
    bgColor: '#F3E5F5',
  },
  {
    id: APPOINTMENT_STATUS_IDS.NO_ASISTIO,
    name: 'No Asistió',
    color: '#607D8B',
    bgColor: '#ECEFF1',
  },
] as const;
