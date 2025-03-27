import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  placeholder?: string;
  fullWidth?: boolean;
  onSearch?: (query: string) => void; // Optional callback for local filtering
  navigateOnSearch?: boolean; // Whether to navigate to search page
  initialValue?: string; // Initial search value
}

export default function SearchBar({
  className = "",
  inputClassName = "",
  buttonClassName = "",
  placeholder = "Search services...",
  fullWidth = false,
  onSearch,
  navigateOnSearch = true,
  initialValue = "",
}: SearchBarProps) {
  const [searchInput, setSearchInput] = useState(initialValue);
  const [, setLocation] = useLocation();

  // Update search input when initialValue changes
  useEffect(() => {
    setSearchInput(initialValue);
  }, [initialValue]);

  const handleSearch = () => {
    const trimmedInput = searchInput.trim();
    
    if (trimmedInput) {
      if (onSearch) {
        onSearch(trimmedInput);
      }
      
      if (navigateOnSearch) {
        // Use direct window.location for more reliable navigation
        window.location.href = `/search?q=${encodeURIComponent(trimmedInput)}`;
      }
    }
  };

  return (
    <div className={`flex gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}>
      <Input
        type="search"
        placeholder={placeholder}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className={`${fullWidth ? 'w-full' : ''} ${inputClassName}`}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <Button 
        type="button"
        onClick={handleSearch}
        className={buttonClassName}
      >
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
}