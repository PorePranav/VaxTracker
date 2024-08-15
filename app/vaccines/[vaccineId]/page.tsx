import VaccineInformation from '@/app/_components/VaccineInformation';
import { getVaccine } from '@/app/_lib/data-service';
import { NextPage } from 'next';
import Link from 'next/link';

interface VaccinePageProps {
  params: { [key: string]: string };
}

export async function generateMetadata({ params }: VaccinePageProps) {
  const { name } = await getVaccine(params.vaccineId);
  return { title: `Vaccine ${name}` };
}

const VaccinePage: NextPage<VaccinePageProps> = async function ({ params }) {
  return (
    <>
      <Link
        href="/vaccines"
        className="bg-primary-50 text-lg rounded-lg px-4 py-2"
      >
        <>&larr; Back</>
      </Link>
      <h1 className="text-4xl mt-6 text-primary-800">Vaccine Information</h1>
      <VaccineInformation vaccineId={params.vaccineId} />
    </>
  );
};

export default VaccinePage;
