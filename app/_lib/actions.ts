'use server';
import { auth, signIn } from '@/app/_lib/auth';
import { supabase } from '@/app/_lib/supabase';
import {
  Child,
  NewImmunization,
  ImmunizationStatus,
  VaccineDueDate,
} from '@/types';
import { revalidatePath } from 'next/cache';

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
    hospital_id: formData.get('hospital_id') as string | null,
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
