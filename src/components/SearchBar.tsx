import { memo, useEffect, useRef, useState } from "react";

const useDebounce = <T extends unknown>(
  value: T,
  callback: (val: T) => void,
) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      callback(value);
    }, 250);
    return () => clearTimeout(timeoutId);
  }, [value]);
};

export const SearchBar = memo(
  ({
    searchValue = "",
    placeholder = "Enter pokemon name...",
    onSearch,
  }: {
    searchValue: string;
    placeholder?: string;
    onSearch: (searchString: string) => void;
  }) => {
    const [search, setSearch] = useState(searchValue);
    useDebounce(search, onSearch);

    return (
      <input
        className="w-4/5 h-full
    p-2
    text-3xl 
    border-4 rounded
    border-white hover:border-yellow-500 focus:border-purple-900
    bg-transparent outline-none
    placeholder:italic placeholder:font-light placeholder:text-purple-900/75 placeholder:text-2xl"
        value={search}
        placeholder={placeholder}
        onChange={(e) => setSearch(e.target.value)}
      />
    );
  },
);
