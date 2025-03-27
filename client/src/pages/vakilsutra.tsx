import React, { useState } from "react";
import VakilsutraSelectCategory from "@/components/vakilsutra/vakilsutra-select-category";
import VakilsutraSearch from "@/components/vakilsutra/vakilsutra-search";

export default function VakilsutraPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // You can add additional search logic here
    console.log("Searching for:", query);
  };

  return (
    <div className="py-8">
      {/* Search Section */}
      <section className="mb-8">
        <div className="container mx-auto px-4">
          <VakilsutraSearch onSearch={handleSearch} />
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4">
        <VakilsutraSelectCategory searchQuery={searchQuery} />
          </section>
    </div>
  );
} 