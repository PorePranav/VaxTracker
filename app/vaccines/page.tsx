import { Vaccine } from '@/types';

import { getVaccines } from '../_lib/data-service';
import VaccineList from '../_components/VaccineList';

export const metadata = {
  title: 'Vaccines',
};

export async function generateStaticParams() {
  const vaccines: Vaccine[] = await getVaccines();
  return vaccines.map((vaccine) => ({ vaccineId: String(vaccine.id) }));
}

export default async function Vaccines() {
  const vaccines: Vaccine[] = await getVaccines();

  return (
    <>
      <h1 className="text-5xl">Vaccines</h1>
      <p className="text-lg mt-2">
        Empowering parents with essential vaccine information for their
        child&apos;s health and well-being
      </p>
      <VaccineList vaccines={vaccines} />
    </>
  );
}
