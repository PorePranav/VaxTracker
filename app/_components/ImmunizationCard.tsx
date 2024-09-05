import { Immunization } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

export default function ImmunizationCard({
  immunizationsList,
}: {
  immunizationsList: Immunization[] | undefined;
}) {
  return (
    <div className="grid grid-cols-2 gap-8 mt-2">
      {immunizationsList?.map((immunization) => (
        <Link href={`/immunizations/${immunization.id}`} key={immunization.id}>
          <div className="border border-primary-200 rounded-lg gap-2 grid p-4">
            {immunization.vaccine?.img_url && (
              <Image
                src={immunization.vaccine.img_url}
                alt="Vaccine photo"
                className="rounded-full"
                height={64}
                width={64}
              />
            )}
            <p>Name: {immunization.child?.name}</p>
            <p>Vaccine: {immunization.vaccine?.name}</p>
            <p>Due Date: {immunization.due_date}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
