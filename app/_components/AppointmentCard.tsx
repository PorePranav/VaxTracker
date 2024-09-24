'use client';
import { Appointment } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { HiChevronRight } from 'react-icons/hi2';

export default function AppointmentCard({
  appointment,
}: {
  appointment: Appointment;
}) {
  return (
    <>
      <Link
        href={`immunizations/${appointment.immunization_id}`}
        className="flex justify-between"
      >
        <div className="flex gap-4 items-center">
          <Image
            src={
              appointment.child?.gender === 'male'
                ? '/boy-avatar.png'
                : '/girl-avatar.png'
            }
            height={64}
            width={64}
            alt={'Child photo'}
          />
          <div>
            <p className="text-lg">{appointment.child?.name}</p>
            <p className="text-primary-500">
              Date: {appointment.scheduled_date}
            </p>
          </div>
        </div>
        <HiChevronRight className="self-center" size={28} />
      </Link>
    </>
  );
}
