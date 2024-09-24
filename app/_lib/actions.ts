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
import { profile } from 'console';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signInAction() {
  await signIn('google', { redirectTo: '/' });
}

export async function createChild(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

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

  const childId = newChildId.id;

  const { data: vaccines, error: vaccineFetchError } = await supabase
    .from('vaccines')
    .select('id, administration_time_date');

  if (vaccineFetchError || !vaccines)
    throw new Error('Vaccines could not be fetched');

  const immunizations: NewImmunization[] = vaccines.map(
    (vaccine: VaccineDueDate) => {
      const dueDate = new Date(newChild.date_of_birth);
      dueDate.setDate(
        dueDate.getDate() + (vaccine.administration_time_date as number)
      );

      return {
        child_id: childId,
        vaccine_id: vaccine.id,
        status: ImmunizationStatus.Upcoming,
        due_date: dueDate.toISOString().split('T')[0],
      };
    }
  );

  const { error: immunizationInsertError } = await supabase
    .from('immunizations')
    .insert(immunizations);

  if (immunizationInsertError)
    throw new Error('Immunizations could not be created');

  revalidatePath(`/children`);
}

export async function updateChild(
  childId: string,
  formData: FormData
): Promise<void> {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const { data: child, error: childFetchError } = await supabase
    .from('children')
    .select('*')
    .eq('id', childId)
    .single();
  if (childFetchError || !child) throw new Error('Child could not be fetched');
  if (child.parent_id !== session.user.userId)
    throw new Error('You do not have permission to update this child');

  const childData = Object.fromEntries(formData.entries());

  const { error } = await supabase
    .from('children')
    .update(childData)
    .eq('id', childId);
  if (error) throw new Error('There was an error updating the information');

  revalidatePath(`/children/${childId}`);
}

export async function scheduleAppointment(
  appointmentData: Appointment
): Promise<void> {
  const { error: appointmentError } = await supabase
    .from('appointments')
    .insert([appointmentData])
    .select('*');

  const { error: immunizationError } = await supabase
    .from('immunizations')
    .update({
      status: ImmunizationStatus.Scheduled,
      scheduled_date: appointmentData.scheduled_date,
    })
    .eq('id', appointmentData.immunization_id);

  if (appointmentError || immunizationError)
    throw new Error('There was an error scheduling the appointment');

  revalidatePath(`/immunizations/${appointmentData.immunization_id}`);
}

export async function updateProfile(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

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

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
