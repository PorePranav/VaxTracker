import ChildProfileCard from '@/app/_components/ChildProfileCard';
import CompletionForm from '@/app/_components/CompletionForm';
import ScheduleAppointment from '@/app/_components/ScheduleAppointment';
import { markAsCompleted } from '@/app/_lib/actions';
import { auth } from '@/app/_lib/auth';
import { getChild, getImmunizationById } from '@/app/_lib/data-service';
import { ImmunizationStatus } from '@/types';
import { differenceInDays } from 'date-fns';
import { NextPage } from 'next';
import { startTransition } from 'react';
import { BsCalendar, BsClock } from 'react-icons/bs';
import { FaSyringe } from 'react-icons/fa6';
import { RiHospitalLine } from 'react-icons/ri';

interface ImmunizationPageProps {
  params: { [key: string]: string };
}

const ImmunizationsPage: NextPage<ImmunizationPageProps> = async function ({
  params,
}) {
  const immunization = await getImmunizationById(params.immunizationId);
  const childData = await getChild(immunization.child_id);
  const today = new Date();
  const dueDate = new Date(immunization.due_date);
  const session = await auth();

  if (immunization.status == 'upcoming' && today > dueDate) {
    immunization.status = ImmunizationStatus.OverDue;
  }

  let date;

  if (immunization.status === 'upcoming' || immunization.status === 'overdue') {
    date = immunization.due_date;
  } else if (immunization.status === 'scheduled') {
    date = immunization.scheduled_date;
  } else {
    date = immunization.date_given;
  }

  const details = [
    {
      icon: <FaSyringe size={28} />,
      label: 'Vaccine',
      value: immunization.vaccine.name,
    },
    {
      icon: <RiHospitalLine size={28} />,
      label: 'Provider',
      value: immunization.child?.hospital.name,
    },
    {
      icon: <BsClock size={28} />,
      label: 'Current Status',
      value:
        immunization.status.charAt(0).toUpperCase() +
        immunization.status.slice(1),
    },
    {
      icon: <BsCalendar size={30} />,
      label: 'Date',
      value: date,
    },
  ];

  return (
    <>
      <h1 className="text-4xl font-semibold">Immunization Details</h1>
      <ChildProfileCard childId={immunization.child_id} />
      <div className="mt-6">
        {immunization.status === ImmunizationStatus.Scheduled &&
          session?.user.role === 'hospital' &&
          session?.user.userId === childData.hospital_id && (
            <CompletionForm
              immunizationId={immunization.id}
              hospitalId={childData.hospital_id}
            />
          )}
        <div className="flex flex-col gap-6 mt-6">
          {details.map((detail, index) => (
            <div className="flex gap-4 items-center" key={index}>
              <div className="bg-primary-50 inline-flex rounded-lg p-4">
                {detail.icon}
              </div>
              <div>
                <p className="text-xl font-semibold">{detail.label}</p>
                <p
                  className={`${detail.value === 'Overdue' && 'text-red-500'}`}
                >
                  {detail.value}
                </p>
              </div>
            </div>
          ))}
        </div>
        {immunization.status === 'upcoming' ||
          (immunization.status === 'overdue' &&
            differenceInDays(new Date(immunization.due_date), new Date()) <
              7 && (
              <ScheduleAppointment
                immunization={immunization}
                childData={childData}
              />
            ))}
      </div>
    </>
  );
};

export default ImmunizationsPage;
