import { useEffect, useState } from 'react';

// A simple implementation of useParams that extracts URL parameters
export function useParams<T extends Record<string, string>>(): T {
  const [params, setParams] = useState<T>({} as T);
  
  useEffect(() => {
    // Extract the ID from the URL
    // This assumes URLs in the format /path/:id
    const pathname = window.location.pathname;
    console.log("Current pathname:", pathname);
    
    const segments = pathname.split('/');
    console.log("URL segments:", segments);
    
    const id = segments[segments.length - 1];
    console.log("Extracted ID:", id);
    
    if (id && id !== '') {
      setParams({ id } as unknown as T);
    } else {
      console.error("Could not extract ID from URL:", pathname);
    }
  }, []);
  
  return params;
}

// A simple implementation of useNavigate for navigation
export function useNavigate() {
  return (path: string) => {
    console.log("Navigating to:", path);
    window.location.href = path;
  };
}