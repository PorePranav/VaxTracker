'use server';
import { auth, signIn } from '@/app/_lib/auth';
import { supabase } from '@/app/_lib/supabase';
import { Child } from '@/types';
import { revalidatePath } from 'next/cache';

export async function signInAction() {
  await signIn('google', { redirectTo: '/' });
}

export async function createChild(formData: FormData): Promise<void> {
  console.log(formData);
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

  const { error } = await supabase.from('children').insert([newChild]);
  if (error) throw new Error('Child could not be created');

  revalidatePath(`/children`);
}
