export interface Clinic {
  id: string;
  name: string;
}

export const MOCK_CLINIC: Clinic = {
  id: 'clinic-1',
  name: 'Shalom Dental',
};

export function getMockClinic(): Clinic {
  return MOCK_CLINIC;
}
