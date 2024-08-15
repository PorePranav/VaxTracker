import { UserDetails } from '@/types';
import { supabase } from './supabase';
import { notFound } from 'next/navigation';

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

export async function getVaccine(id: string) {
  const { data, error } = await supabase
    .from('vaccines')
    .select('*')
    .eq('id', id)
    .single();

  if (error) notFound();

  return data;
}
