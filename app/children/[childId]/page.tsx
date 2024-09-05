import ChildProfile from '@/app/_components/ChildProfile';
import { getChild } from '@/app/_lib/data-service';

interface ChildInfoPageProps {
  params: { [key: string]: string };
}

export async function generateMetadata({ params }: ChildInfoPageProps) {
  const { name } = await getChild(params.childId);
  return { title: `${name}` };
}

export default async function ChildInfoPage({ params }: ChildInfoPageProps) {
  return (
    <>
      <h1 className="text-4xl font-semibold">Child Profile</h1>
      <ChildProfile childId={params.childId} />
    </>
  );
}
