'use server';
import { auth, signIn, signOut } from '@/app/_lib/auth';
import { supabase } from '@/app/_lib/supabase';
import {
  Child,
  NewImmunization,
  ImmunizationStatus,
  VaccineDueDate,
  Appointment,
} from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function checkSession() {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');
  return session;
}

export async function signInAction() {
  await signIn('google', { redirectTo: '/' });
}

export async function createChild(formData: FormData): Promise<void> {
  const session = await checkSession();

  const gender = formData.get('gender') as 'male' | 'female';
  if (!gender) throw new Error('Gender is a required field.');

  const newChild: Child = {
    name: formData.get('name') as string,
    date_of_birth: formData.get('date_of_birth') as string,
    gender,
    hospital_id: formData.get('hospital_id') as string,
    parent_id: session.user.userId,
  };

  const { data: newChildId, error: childInsertError } = await supabase
    .from('children')
    .insert([newChild])
    .select('id')
    .single();

  if (childInsertError || !newChildId)
    throw new Error('Child could not be created');

  const vaccines = await fetchVaccines();

  const immunizations = createImmunizations(
    vaccines,
    newChildId.id,
    newChild.date_of_birth
  );
  await insertImmunizations(immunizations);

  revalidatePath(`/children`);
}

async function fetchVaccines() {
  const { data: vaccines, error: vaccineFetchError } = await supabase
    .from('vaccines')
    .select('id, administration_time_date');

  if (vaccineFetchError || !vaccines)
    throw new Error('Vaccines could not be fetched');
  return vaccines;
}

function createImmunizations(
  vaccines: VaccineDueDate[],
  childId: string,
  dob: string
) {
  return vaccines.map((vaccine: VaccineDueDate) => {
    const dueDate = new Date(dob);
    dueDate.setDate(
      dueDate.getDate() + (vaccine.administration_time_date as number)
    );
    return {
      child_id: childId,
      vaccine_id: vaccine.id,
      status: ImmunizationStatus.Upcoming,
      due_date: dueDate.toISOString().split('T')[0],
    };
  });
}

async function insertImmunizations(immunizations: NewImmunization[]) {
  const { error: immunizationInsertError } = await supabase
    .from('immunizations')
    .insert(immunizations);

  if (immunizationInsertError)
    throw new Error('Immunizations could not be created');
}

export async function updateChild(
  childId: string,
  formData: FormData
): Promise<void> {
  const session = await checkSession();

  const child = await fetchChild(childId, session.user.userId);
  const childData = Object.fromEntries(formData.entries());

  const { error } = await supabase
    .from('children')
    .update(childData)
    .eq('id', childId);

  if (error) throw new Error('There was an error updating the information');

  revalidatePath(`/children/${childId}`);
}

async function fetchChild(childId: string, parentId: string) {
  const { data: child, error: childFetchError } = await supabase
    .from('children')
    .select('*')
    .eq('id', childId)
    .single();

  if (childFetchError || !child) throw new Error('Child could not be fetched');
  if (child.parent_id !== parentId)
    throw new Error('You do not have permission to update this child');

  return child;
}

export async function scheduleAppointment(
  appointmentData: Appointment
): Promise<void> {
  const session = await checkSession();

  await insertAppointment(appointmentData);
  await updateImmunizationStatus(
    appointmentData.immunization_id,
    ImmunizationStatus.Scheduled,
    appointmentData.scheduled_date
  );

  revalidatePath(`/immunizations/${appointmentData.immunization_id}`);
}

async function insertAppointment(appointmentData: Appointment) {
  const { error: appointmentError } = await supabase
    .from('appointments')
    .insert([appointmentData])
    .select('*');

  if (appointmentError)
    throw new Error('There was an error scheduling the appointment');
}

async function updateImmunizationStatus(
  immunizationId: string,
  status: ImmunizationStatus,
  scheduledDate?: string
) {
  const updateData = {
    status,
    ...(scheduledDate && { scheduled_date: scheduledDate }),
  };

  const { error: immunizationError } = await supabase
    .from('immunizations')
    .update(updateData)
    .eq('id', immunizationId);

  if (immunizationError)
    throw new Error('There was an error updating the immunization');
}

export async function updateProfile(formData: FormData): Promise<void> {
  const session = await checkSession();

  const { name, role } = Object.fromEntries(formData.entries());

  const { error } = await supabase
    .from('users')
    .update({
      name: name as string,
      role: role as string,
      is_profile_complete: true,
    })
    .eq('id', session.user.userId);

  if (error) throw new Error('There was an error updating the information');

  revalidatePath(`/profile`);
  redirect(`/`);
}

export async function markAsCompleted(
  immunizationId: string,
  hospitalId: string
) {
  const session = await checkSession();

  if (session.user.role !== 'hospital' || session.user.userId !== hospitalId)
    throw new Error('You are not authorized to perform this action');

  await updateImmunizationStatus(
    immunizationId,
    ImmunizationStatus.Completed,
    new Date().toISOString().split('T')[0]
  );

  revalidatePath(`/immunizations/${immunizationId}`);
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
