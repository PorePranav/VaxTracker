'use client';

import { HiMagnifyingGlass } from 'react-icons/hi2';
import { ChangeEvent } from 'react';

interface SearchBoxProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="relative mt-4">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search..."
        className="pl-10 pr-4 py-2 border bg-primary-50 border-primary-600 placeholder:text-primary-900 text-primary-900 rounded-lg focus:outline-none"
      />
      <div className="absolute left-0 top-0 flex items-center justify-center pl-3 h-full pointer-events-none">
        <HiMagnifyingGlass className="text-primary-900" />
      </div>
    </div>
  );
}
