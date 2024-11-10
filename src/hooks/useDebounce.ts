import { useEffect, useState } from 'react';

export const useDebounce = ({ value, miniSeconds }: { value: string; miniSeconds: number }) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, miniSeconds);

    return () => {
      clearTimeout(handler);
    };
  }, [value, miniSeconds]);

  return debounceValue;
};
