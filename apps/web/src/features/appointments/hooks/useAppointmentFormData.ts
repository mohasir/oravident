'use client';

import { useBranchesQuery } from '@/features/branches/hooks/useBranchesQuery';
import { usePatientsQuery } from '@/features/patients/hooks/usePatientsQuery';
import { useDoctorsQuery } from '@/features/doctors/hooks/useDoctorsQuery';
import { useServicesQuery } from '@/features/services/hooks/useServicesQuery';
import { useAppointmentStatusesQuery } from './useAppointmentsQuery';

export function useAppointmentFormData() {
  const { data: branchesData } = useBranchesQuery();
  const { data: patientsData } = usePatientsQuery({ limit: 100 });
  const { data: doctorsData } = useDoctorsQuery({ limit: 100 });
  const { data: servicesData } = useServicesQuery({ limit: 100 });
  const { data: statusesData } = useAppointmentStatusesQuery();

  return {
    branches: branchesData?.data?.items ?? [],
    patients: patientsData?.data?.items ?? [],
    doctors: doctorsData?.data?.items ?? [],
    services: servicesData?.data?.items ?? [],
    statuses: statusesData?.data ?? [],
  };
}
