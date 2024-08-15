import { Vaccine } from '@/types';

import { HiChevronRight } from 'react-icons/hi2';
import Image from 'next/image';
import Link from 'next/link';

interface VaccineCardProps {
  vaccine: Vaccine;
}

const VaccineCard: React.FC<VaccineCardProps> = function ({ vaccine }) {
  return (
    <div key={vaccine.id}>
      <Link href={`/vaccines/${vaccine.id}`}>
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="relative h-16 aspect-square">
              <Image
                src={vaccine.img_url}
                className="rounded-full object-cover"
                sizes="(max-width: 768px) 100vw, 128px"
                fill
                alt="Vaccine Thumbnail"
              />
            </div>
            <h1 className="text-md font-semibold">{vaccine.name}</h1>
          </div>
          <HiChevronRight size={28} />
        </div>
      </Link>
    </div>
  );
};

export default VaccineCard;
