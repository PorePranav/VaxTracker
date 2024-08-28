'use client';
import { Child } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import SearchBox from './SearchBox';

export default function ChildrenCard({
  childrenList,
}: {
  childrenList: Child[] | undefined;
}) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  if (!childrenList) return;

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
  }

  const filteredChildren = childrenList.filter((child) =>
    child.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SearchBox value={searchQuery} onChange={handleInputChange} />
      <div className="grid grid-cols-2 gap-8 mt-8">
        {filteredChildren.map((child: Child) => (
          <Link href={`/children/${child.id}`} key={child.id}>
            <div className="border border-primary-200 rounded-lg gap-2 grid p-4">
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
              <p className="text-lg">Name: {child.name}</p>
              <p className="text-lg">Birthdate: {child.date_of_birth}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
