import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { searchServices, type Service } from "@/data/services";

export default function SearchPage() {
  const [location] = useLocation();
  const [results, setResults] = useState<Service[]>([]);
  const [query, setQuery] = useState("");
  
  useEffect(() => {
    // Extract query from URL
    const searchParams = new URLSearchParams(location.split("?")[1]);
    const q = searchParams.get("q") || "";
    setQuery(q);
    
    // Perform search
    if (q) {
      const searchResults = searchServices(q);
      setResults(searchResults);
    }
  }, [location]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>
      
      {query ? (
        <>
          <p className="text-lg mb-8">
            {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
          </p>
          
          {results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((service) => (
                <Link key={service.title} href={service.link}>
                  <a className="flex flex-col items-center p-6 border rounded-lg hover:shadow-md transition-shadow bg-card">
                    <span className="text-4xl mb-3">{service.icon}</span>
                    <span className="text-base text-center font-medium mb-1">{service.title}</span>
                    <span className="text-xs text-center text-muted-foreground capitalize">{service.category}</span>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl mb-4">No services found matching your search.</p>
              <p className="text-muted-foreground mb-6">Try searching for a different term or browse our services categories.</p>
              <Link href="/gogo">
                <a className="text-primary hover:underline">Browse all services</a>
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl">Please enter a search term to find services.</p>
        </div>
      )}
    </div>
  );
}