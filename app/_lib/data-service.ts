import {
  Appointment,
  AppointmentCounts,
  Child,
  HospitalChildRegistration,
  Immunization,
  UserDetails,
  Vaccine,
} from '@/types';
import { supabase } from './supabase';
import { auth } from './auth';
import { notFound } from 'next/navigation';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateImmunizationPDF(
  childId: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([600, 800]);
  const records = await getImmunizationsByChildId(childId);
  const child = await getChild(childId);

  const mainColor = rgb(0.518, 0.239, 0.961);
  const blackColor = rgb(0, 0, 0);
  const grayColor = rgb(0.4, 0.4, 0.4);
  const whiteColor = rgb(1, 1, 1);

  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let yOffset = 750;
  const fontSize = 12;
  const headerFontSize = 28;
  const subHeaderFontSize = 16;
  const lineHeight = 20;

  page.drawRectangle({
    x: 0,
    y: yOffset - 50,
    width: 600,
    height: 60,
    color: mainColor,
  });

  page.drawText(`VaxTracker`, {
    x: 50,
    y: yOffset - 25,
    size: headerFontSize,
    font: boldFont,
    color: whiteColor,
  });

  yOffset -= 100;

  page.drawText(`Immunization Records Report`, {
    x: 50,
    y: yOffset,
    size: subHeaderFontSize,
    font: boldFont,
    color: mainColor,
  });

  yOffset -= 30;

  page.drawText(`Child: ${child.name}`, {
    x: 50,
    y: yOffset,
    size: fontSize,
    font: boldFont,
    color: blackColor,
  });
  yOffset -= lineHeight;
  page.drawText(`Date of Birth: ${child.date_of_birth}`, {
    x: 50,
    y: yOffset,
    size: fontSize,
    font: regularFont,
    color: blackColor,
  });
  yOffset -= lineHeight * 2;

  const columns = [
    { header: 'Vaccine', x: 50, width: 250 },
    { header: 'Due Date', x: 300, width: 150 },
    { header: 'Date Given', x: 450, width: 100 },
  ];

  columns.forEach((col) => {
    page.drawText(col.header, {
      x: col.x,
      y: yOffset,
      size: fontSize,
      font: boldFont,
      color: mainColor,
    });
  });

  yOffset -= lineHeight * 1.5;

  page.drawLine({
    start: { x: 40, y: yOffset + 5 },
    end: { x: 560, y: yOffset + 5 },
    thickness: 1,
    color: grayColor,
  });

  yOffset -= 10;

  records.forEach((record: Immunization) => {
    if (yOffset < 50) {
      page = pdfDoc.addPage([600, 800]);
      yOffset = 750;
    }

    const vaccineNameLines = splitTextIntoLines(record.vaccine.name, 30);
    vaccineNameLines.forEach((line, index) => {
      page.drawText(line, {
        x: columns[0].x,
        y: yOffset - index * (fontSize + 2),
        size: fontSize,
        font: regularFont,
        color: blackColor,
      });
    });

    page.drawText(record.due_date || 'N/A', {
      x: columns[1].x,
      y: yOffset,
      size: fontSize,
      font: regularFont,
      color: blackColor,
    });
    page.drawText(record.date_given || '-', {
      x: columns[2].x,
      y: yOffset,
      size: fontSize,
      font: regularFont,
      color: blackColor,
    });

    yOffset -= Math.max(lineHeight, vaccineNameLines.length * (fontSize + 2));

    page.drawLine({
      start: { x: 40, y: yOffset + 5 },
      end: { x: 560, y: yOffset + 5 },
      thickness: 0.5,
      color: grayColor,
    });

    yOffset -= 10;
  });

  const pageCount = pdfDoc.getPageCount();
  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPage(i);
    page.drawText(`Page ${i + 1} of ${pageCount}`, {
      x: 50,
      y: 30,
      size: 10,
      font: regularFont,
      color: grayColor,
    });
  }

  return await pdfDoc.save();
}

function splitTextIntoLines(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length + word.length + 1 <= maxChars) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

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

async function getChildrenByUser(sessionUserId: string, role: string) {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq(`${role}_id`, sessionUserId);

  if (error) throw new Error('There was an error fetching data');
  return data as Child[];
}

export async function getChildrenParent(): Promise<Child[] | undefined> {
  const session = await auth();
  if (!session) return;
  return getChildrenByUser(session.user.userId, 'parent');
}

export async function getChildrenHospital(): Promise<Child[] | undefined> {
  const session = await auth();
  if (!session) return;
  return getChildrenByUser(session.user.userId, 'hospital');
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

  if (error) throw new Error('Error fetching hospital details');
  return data as HospitalChildRegistration[];
}

export async function getImmunizationById(
  immunizationId: string
): Promise<Immunization> {
  const { data, error } = await supabase
    .from('immunizations')
    .select(
      `
      id, created_at, date_given, due_date, scheduled_date, status,
      child_id, child:children(id, name, hospital_id, hospital:users!children_hospital_id_fkey(name)),
      vaccine_id, vaccine:vaccines(name, img_url)
    `
    )
    .eq('id', immunizationId)
    .single();

  if (error) throw new Error('Error fetching immunization');
  return data as Immunization;
}

export async function getImmunizationsByChildId(
  childId: string
): Promise<Immunization[]> {
  const { data, error } = await supabase
    .from('immunizations')
    .select(
      `
      id, date_given, due_date, status,
      vaccine:vaccines(name, img_url)
    `
    )
    .eq('child_id', childId)
    .order('due_date', { ascending: true });

  if (error) throw new Error('Error fetching immunizations');
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

  if (childrenError || !childrenData?.length) return;

  const childIds = childrenData.map((child: { id: string }) => child.id);
  const { data: immunizationsData, error: immunizationError } = await supabase
    .from('immunizations')
    .select(
      `
      id, created_at, date_given, due_date, scheduled_date, status,
      child_id, child:children(id, name),
      vaccine_id, vaccine:vaccines(name, img_url)
    `
    )
    .in('child_id', childIds)
    .order('due_date', { ascending: true })
    .limit(4);

  if (immunizationError) return;
  return immunizationsData as Immunization[];
}

export async function getScheduledAppointmentsHospital(): Promise<
  Appointment[] | undefined
> {
  const session = await auth();
  if (!session) return;

  const { data, error } = await supabase
    .from('appointments')
    .select(
      `
      child_id, child:children(id, name, gender),
      hospital_id, immunization_id, scheduled_date,
      immunization:immunizations!inner(id, status)
    `
    )
    .eq('hospital_id', session.user.userId)
    .eq('immunization.status', 'scheduled')
    .order('scheduled_date', { ascending: true });

  if (error) return;
  return data as Appointment[];
}

export async function getStatistics(
  hospitalId: string
): Promise<AppointmentCounts | null> {
  const today = new Date().toISOString().split('T')[0];

  const [
    { count: childrenCount },
    { count: todayAppointments },
    { count: overdueAppointments },
    { count: upcomingAppointments },
  ] = await Promise.all([
    supabase
      .from('children')
      .select('*', { count: 'exact', head: true })
      .eq('hospital_id', hospitalId),
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('hospital_id', hospitalId)
      .eq('scheduled_date', today),
    supabase
      .from('immunizations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'scheduled')
      .lt('scheduled_date', today)
      .in(
        'child_id',
        (
          await supabase
            .from('children')
            .select('id')
            .eq('hospital_id', hospitalId)
        ).data?.map((child: { id: string }) => child.id) || []
      ),
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('hospital_id', hospitalId)
      .gt('scheduled_date', today),
  ]);

  return {
    childrenCount: childrenCount || 0,
    todayAppointments: todayAppointments || 0,
    overdueAppointments: overdueAppointments || 0,
    upcomingAppointments: upcomingAppointments || 0,
  };
}
