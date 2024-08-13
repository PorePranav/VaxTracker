import { UserDetails } from '@/tyes';
import { supabase } from './supabase';

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
