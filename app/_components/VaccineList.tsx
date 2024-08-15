'use client';
import { Vaccine } from '@/types';

import { useState } from 'react';

import SearchBox from './SearchBox';
import VaccineCard from './VaccineCard';

export default function VaccineList({ vaccines }: { vaccines: Vaccine[] }) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  function handleInputChage(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
  }

  const filteredVaccines = vaccines.filter((vaccine) =>
    vaccine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SearchBox value={searchQuery} onChange={handleInputChage} />
      <div className="mt-4 flex flex-col gap-4">
        {filteredVaccines.map((vaccine) => (
          <VaccineCard key={vaccine.id} vaccine={vaccine} />
        ))}
      </div>
    </>
  );
}
