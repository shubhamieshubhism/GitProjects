import { User, Appointment, Enquiry, Service, Role, ServiceType, AppointmentStatus, EnquiryStatus } from "@prisma/client";

export type { User, Appointment, Enquiry, Service, Role, ServiceType, AppointmentStatus, EnquiryStatus };

export interface AppointmentWithUser extends Appointment {
  user: Pick<User, "name" | "email" | "phone">;
}

export interface EnquiryWithStatus extends Enquiry {
  // Add any computed fields
}

export interface ServiceWithForm extends Service {
  // For form handling
}