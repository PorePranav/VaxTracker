import Image from 'next/image';
import Link from 'next/link';

import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBell,
  HiOutlineDocumentText,
} from 'react-icons/hi2';

const features: {
  icon: React.ReactElement;
  title: string;
  description: string;
}[] = [
  {
    icon: <HiOutlineDocumentText size={26} />,
    title: 'Digital Records',
    description: "Acess your child's immunization history anytime, anywhere",
  },
  {
    icon: <HiOutlineBell size={26} />,
    title: 'Reminders & Alerts',
    description: 'Get timely notifications for upcoming vaccinations',
  },
  {
    icon: <HiOutlineArrowTopRightOnSquare size={26} />,
    title: 'Shareable Profiles',
    description:
      'Easily share records with schools and healthcare professionals',
  },
];

export default function LandingPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-2 gap-8">
        <div className="relative aspect-video">
          <Image
            src="/hero.png"
            fill
            className="object-cover rounded-xl shadow-md"
            alt="Hero Image"
          />
        </div>
        <div className="grid">
          <h1 className="text-5xl font-bold">
            Safe & Secure Immunization <br /> Tracking
          </h1>
          <p className="text-xl">
            With VaxTracker, effortlessly manage your child&apos;s immunization
            records in one place.
          </p>
          <Link href="/login" className="h-full flex">
            <button className="w-full bg-primary-600 text-white rounded-full text-xl font-semibold">
              Get Started
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-3xl font-semibold">Why Choose VaxTracker?</h2>
        <p className="mt-4 text-lg">
          Designed for parents and healthcare providers to ensure that no shot
          is missed
        </p>
        <div className="grid grid-cols-3 mt-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="border p-4 border-primary-200 rounded-lg"
            >
              {feature.icon}
              <h2 className="mt-2 font-semibold text-lg">{feature.title}</h2>
              <p className="mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
