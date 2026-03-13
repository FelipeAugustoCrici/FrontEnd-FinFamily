import { useState } from 'react';

export function useFamilyFilters() {
  const [search, setSearch] = useState('');

  return {
    search,
    setSearch,
  };
}
