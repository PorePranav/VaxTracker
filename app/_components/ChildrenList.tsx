'use client';
import { Child, HospitalChildRegistration } from '@/types';
import { useState } from 'react';
import SearchBox from './SearchBox';
import Image from 'next/image';
import Link from 'next/link';
import { HiChevronRight } from 'react-icons/hi2';

export default function ChildrenList({
  childrenList,
}: {
  childrenList: Child[] | undefined;
}) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  if (!childrenList) return;

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  const filteredChildren = childrenList.filter((child) =>
    child.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between">
        <SearchBox value={searchQuery} onChange={handleInputChange} />
      </div>
      <div className="flex flex-col gap-4 mt-8">
        {filteredChildren.map((child: Child) => (
          <Link
            href={`/children/${child.id}`}
            className="flex justify-between"
            key={child.id}
          >
            <div className="flex gap-4 items-center">
              <Image
                src={
                  child.gender === 'male'
                    ? '/boy-avatar.png'
                    : '/girl-avatar.png'
                }
                alt="Child photo"
                height={64}
                width={64}
              />
              <div>
                <p className="text-lg font-semibold">{child.name}</p>
                <p className="text-primary-300">{child.date_of_birth}</p>
              </div>
            </div>
            <HiChevronRight className="self-center" size={28} />
          </Link>
        ))}
      </div>
    </>
  );
}
