import { Child } from '@/types';
import { differenceInYears } from 'date-fns';
import Image from 'next/image';
import { getChild } from '../_lib/data-service';

export default async function ChildProfileCard({
  childId,
}: {
  childId: string;
}) {
  const childData: Child = await getChild(childId);
  return (
    <div className="flex justify-between mt-8">
      <div className="flex gap-x-4 items-center">
        <Image
          src={
            childData.gender === 'male' ? '/boy-avatar.png' : '/girl-avatar.png'
          }
          height={128}
          width={128}
          alt="Child Avatar"
        />
        <div className="flex flex-col">
          <p className="text-2xl font-semibold">{childData.name}</p>
          <p className="text-xl">
            {differenceInYears(new Date(), new Date(childData.date_of_birth))}{' '}
            years old
          </p>
        </div>
      </div>
    </div>
  );
}
