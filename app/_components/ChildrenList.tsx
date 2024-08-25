'use client';
import { Child } from '@/types';
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
  console.log(childrenList);
  if (!childrenList) return;

  const [searchQuery, setSearchQuery] = useState<string>('');

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
        <button className="px-4 font-semibold bg-primary-600 text-white rounded-lg">
          Add New Child
        </button>
      </div>
      <div className="flex flex-col gap-4 mt-8">
        {filteredChildren.map((child: Child) => (
          <Link href={`/children/${child.id}`} className="flex justify-between">
            <div className="flex gap-4 items-center">
              {child.photo_url && (
                <Image
                  src={child.photo_url}
                  alt="Child photo"
                  height={64}
                  width={64}
                />
              )}
              <div>
                <p className="text-lg font-semibold">{child.name}</p>
                <p className="text-primary-300">{child.date_of_birth}</p>
              </div>
            </div>
            <HiChevronRight size={28} />
          </Link>
        ))}
      </div>
    </>
  );
}
