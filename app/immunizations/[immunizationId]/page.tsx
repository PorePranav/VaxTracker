import ChildProfileCard from '@/app/_components/ChildProfileCard';
import { getImmunizationById } from '@/app/_lib/data-service';
import { ImmunizationStatus } from '@/types';
import { differenceInDays } from 'date-fns';
import { NextPage } from 'next';
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
  const today = new Date();
  const dueDate = new Date(immunization.due_date);

  if (immunization.status !== 'completed' && today > dueDate) {
    immunization.status = ImmunizationStatus.OverDue;
  }
  const date =
    immunization.status === 'upcoming' || immunization.status === 'overdue'
      ? immunization.due_date
      : immunization.status === 'scheduled'
      ? immunization.scheduled_date
      : immunization.date_given;

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
        <div className="flex flex-col gap-6">
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
              <button className="w-full bg-primary-600 text-white font-semibold text-xl mt-4 rounded-lg py-2">
                Schedule Appointment
              </button>
            ))}
      </div>
    </>
  );
};

export default ImmunizationsPage;
