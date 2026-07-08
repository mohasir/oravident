export interface Appointment {
  id: string;
  startsAt: string;
  endsAt: string;
  notes?: string;
  price?: string;
  discountAmount?: string;
  taxAmount?: string;
  isActive: boolean;
  cancelledAt?: string;
  cancelledBy?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
  clinic?: {
    id: string;
    name: string;
  };
  branch?: {
    id: string;
    name: string;
    color: string;
  };
  patient?: {
    id: string;
    fullName: string;
    firstName?: string;
    lastName?: string;
  };
  worker?: {
    id: string;
    fullName: string;
    prefix?: string;
    specialty?: string;
  };
  service?: {
    id: string;
    name: string;
    durationMinutes: number;
  };
  status?: {
    id: string;
    name: string;
    color?: string;
  };
}

export interface GetAppointmentsParams {
  id?: string;
  page?: number;
  limit?: number;
  clinicId?: string;
  branchId?: string;
  patientId?: string;
  workerId?: string;
  statusId?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface CreateAppointmentDTO {
  branchId: string;
  patientId: string;
  workerId: string;
  serviceId: string;
  statusId: string;
  startsAt: string;
  endsAt: string;
  notes?: string;
  price?: string;
}

export interface UpdateAppointmentDTO {
  branchId?: string;
  patientId?: string;
  workerId?: string;
  serviceId?: string;
  statusId?: string;
  startsAt?: string;
  endsAt: string;
  notes?: string;
  price?: string;
}

export interface AppointmentStatus {
  id: string;
  name: string;
  color?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Appointment;
}
