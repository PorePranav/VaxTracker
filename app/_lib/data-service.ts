import { Child, Immunization, UserDetails, Vaccine } from '@/types';
import { supabase } from './supabase';
import { notFound } from 'next/navigation';
import { auth } from './auth';

export async function getUser(email: string) {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  return data;
}

export async function createUser(newUser: UserDetails) {
  const { error } = await supabase.from('users').insert([newUser]);
  if (error) throw new Error('User could not be created');
}

export async function getVaccines() {
  const { data, error } = await supabase.from('vaccines').select('*');

  if (error) throw new Error('Could not fetch vaccines');
  return data;
}

export async function getVaccine(id: string): Promise<Vaccine> {
  const { data, error } = await supabase
    .from('vaccines')
    .select('*')
    .eq('id', id)
    .single();

  if (error) notFound();

  return data;
}

export async function getChildren(id: string): Promise<Child[] | undefined> {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('parent_id', id);

  if (error) throw new Error('There was an error fetching data');

  return data as Child[];
}

export async function getImmunizationsByUser(
  id: string
): Promise<Immunization[] | undefined> {
  const session = await auth();
  if (!session) return;

  const { data: childrenData, error: childrenError } = await supabase
    .from('children')
    .select('id')
    .eq('parent_id', session.user.userId);

  if (childrenError || !childrenData || childrenData.length === 0) return;

  const childIds = childrenData.map((child) => child.id);

  const { data: immunizationsData, error: immunizationError } = await supabase
    .from('immunizations')
    .select(
      `
      id,
      created_at,
      date_given,
      due_date,
      status,
      child_id,
      child:children(id, name, photo_url),
      vaccine_id,
      vaccine:vaccines(name, img_url)
      `
    )
    .in('child_id', childIds)
    .order('due_date', { ascending: true });

  if (immunizationError) return;

  return immunizationsData as Immunization[];
}
