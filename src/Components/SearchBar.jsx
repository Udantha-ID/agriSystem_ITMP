import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${query}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="px-4 py-2 w-64 md:w-80 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-700"
      >
        <FiSearch size={20} />
      </button>
    </form>
  );
}
