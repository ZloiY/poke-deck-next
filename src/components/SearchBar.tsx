import { useEffect, useRef, useState } from "react"

const useDebounce = <T extends unknown>(value: T, callback: (val: T) => void) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      callback(value);
    }, 250)
    return () => clearTimeout(timeoutId);
  }, [value])
}

export const SearchBar = ({ searchValue = '', onSearch }: { searchValue: string, onSearch: (searchString: string) => void }) => {
  const [search, setSearch] = useState(searchValue);
  useDebounce(search, onSearch)
  
  return <input
  className="w-full h-full text-3xl p-2 border-4 border-white rounded bg-transparent hover:border-yellow-500 focus:border-purple-900 outline-none"
  value={search}
  onChange={(e) => setSearch(e.target.value)}/>
}