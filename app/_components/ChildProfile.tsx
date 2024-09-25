import { Child, HospitalChildRegistration, Immunization } from '@/types';
import React from 'react';
import {
  getChild,
  getHospitals,
  getImmunizationsByChildId,
} from '../_lib/data-service';
import Image from 'next/image';
import Link from 'next/link';
import { HiChevronRight } from 'react-icons/hi2';
import ChildProfileCard from './ChildProfileCard';
import EditChild from '@/app/_components/EditChild';
import { auth } from '../_lib/auth';
import GenerateReport from './GenerateReport';

interface ChildProfileProps {
  childId: string;
}

const ChildProfile: React.FC<ChildProfileProps> = async function ({ childId }) {
  const childData: Child = await getChild(childId);
  const immunizations: Immunization[] = await getImmunizationsByChildId(
    childId
  );
  const hospitalList: HospitalChildRegistration[] | undefined =
    await getHospitals();
  const session = await auth();
  if (!session) return;

  return (
    <>
      <ChildProfileCard childId={childId} />
      <div className="mt-6">
        <h2 className="text-2xl font-semibold">Personal Information</h2>
        <div className="flex flex-col gap-4 mt-4">
          <div>
            <p className="font-semibold text-xl">Gender</p>
            <p className="text-primary-400 text-lg">
              {childData.gender.charAt(0).toUpperCase() +
                childData.gender.slice(1)}
            </p>
          </div>
          <div>
            <p className="font-semibold text-xl">Date of Birth</p>
            <p className="text-primary-400 text-lg">
              {childData.date_of_birth}
            </p>
          </div>
          <div className="flex mt-4 gap-4">
            {session.user.role === 'parent' && (
              <EditChild hospitalList={hospitalList} childData={childData} />
            )}
            <GenerateReport childId={childData.id} />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-semibold">Immunization Details</h2>
        <div className="flex flex-col gap-4 mt-4">
          {immunizations.map((immunization: Immunization) => (
            <Link
              href={`/immunizations/${immunization.id}`}
              key={immunization.id}
              className="flex items-center justify-between"
            >
              <div className="flex gap-6">
                <div className="aspect-square relative h-16 w-16">
                  <Image
                    src={immunization.vaccine.img_url}
                    fill
                    className="rounded-full"
                    alt="Vaccine"
                  />
                </div>
                <div>
                  <p className="font-semibold text-lg">
                    Vaccine: {immunization.vaccine.name}
                  </p>
                  <p className="text-primary-400">
                    {immunization.date_given ? (
                      <>Date Given: {immunization.date_given}</>
                    ) : (
                      <>Due Date: {immunization.due_date}</>
                    )}
                  </p>
                </div>
              </div>
              <HiChevronRight className="self-center" size={28} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChildProfile;
