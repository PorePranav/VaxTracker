export interface UserDetails {
  name: string;
  email: string;
  role?: string;
  location?: string;
}

export interface HospitalChildRegistration {
  id: string;
  name: string;
}

export interface VaccineDueDate {
  id: string;
  administration_time_date: number | null;
}

export interface Vaccine {
  administration_age: string | null;
  id: string;
  importance: string | null;
  protects_against: string | null;
  name: string;
  side_effects: string | null;
  img_url: string;
  administration_time_date: number;
}

export interface Child {
  id?: string;
  parent_id: string;
  name: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  hospital_id?: string | null;
}

export interface NewImmunization {
  child_id: string;
  vaccine_id: string;
  status: ImmunizationStatus;
  due_date: string;
  date_given?: string | null;
}

export interface Immunization {
  child_id: string | null;
  created_at: string | null;
  date_given: string | null;
  due_date: string;
  id: string;
  status: ImmunizationStatus;
  child: {
    id: string;
    name: string;
    photo_url: string | null;
  } | null;
  vaccine: {
    name: string;
    img_url: string;
  } | null;
}

export enum ImmunizationStatus {
  Upcoming = 'upcoming',
  Scheduled = 'scheduled',
  Completed = 'completed',
}
