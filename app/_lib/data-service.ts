import {
  Child,
  HospitalChildRegistration,
  Immunization,
  UserDetails,
  Vaccine,
} from '@/types';
import { supabase } from './supabase';
import { auth } from './auth';
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

export async function getVaccines(): Promise<Vaccine[]> {
  const { data, error } = await supabase.from('vaccines').select('*');

  if (error) throw new Error('Could not fetch vaccines');
  return data as Vaccine[];
}

export async function getVaccine(id: string): Promise<Vaccine> {
  const { data, error } = await supabase
    .from('vaccines')
    .select('*')
    .eq('id', id)
    .single();

  if (error) notFound();
  return data as Vaccine;
}

export async function getChildren(id: string): Promise<Child[] | undefined> {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('parent_id', id);

  if (error) throw new Error('There was an error fetching data');
  return data as Child[];
}

export async function getChild(id: string): Promise<Child> {
  const session = await auth();

  const { data } = await supabase
    .from('children')
    .select('*')
    .eq('id', id)
    .single();

  if (!data) notFound();
  if (session?.user.role === 'parent' && data.parent_id !== session.user.userId)
    throw new Error('You are not authorized to view this child');

  return data as Child;
}

export async function getHospitals(): Promise<
  HospitalChildRegistration[] | undefined
> {
  const { data, error } = await supabase
    .from('users')
    .select('id, name')
    .eq('role', 'hospital');

  if (error) throw new Error('Error fetching hospital detials');

  return data as HospitalChildRegistration[];
}

export async function getImmunizationById(
  immunizationId: string
): Promise<Immunization> {
  const { data, error } = await supabase
    .from('immunizations')
    .select(
      `id,
      created_at,
      date_given,
      due_date,
      scheduled_date,
      status,
      child_id,
      child:children(id, name, hospital_id, hospital:users!children_hospital_id_fkey(name)),
      vaccine_id,
      vaccine:vaccines(name, img_url)`
    )
    .eq('id', immunizationId)
    .single();

  if (error) throw new Error('There was an error fetching data');
  return data as Immunization;
}

export async function getImmunizationsByChildId(
  childId: string
): Promise<Immunization[]> {
  const { data, error } = await supabase
    .from('immunizations')
    .select(
      `
      id,
      date_given,
      due_date,
      status,
      vaccine:vaccines(name, img_url)
      `
    )
    .eq('child_id', childId)
    .order('due_date', { ascending: true });

  if (error) throw new Error('There was an error fetching data');
  return data as Immunization[];
}

export async function getImmunizationsDashboard(): Promise<
  Immunization[] | undefined
> {
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
      scheduled_date,
      status,
      child_id,
      child:children(id, name, photo_url),
      vaccine_id,
      vaccine:vaccines(name, img_url)
      `
    )
    .in('child_id', childIds)
    .order('due_date', { ascending: true })
    .limit(4);

  if (immunizationError) return;

  return immunizationsData as Immunization[];
}
