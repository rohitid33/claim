import React, { useState } from "react";
import { Search } from "lucide-react";

interface VakilsutraSearchProps {
  onSearch: (query: string) => void;
}

export default function VakilsutraSearch({ onSearch }: VakilsutraSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for legal services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>
    </form>
  );
} 