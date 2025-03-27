import React from "react";
import { Button } from "@/components/ui/button";

const mediaCategories = [
  { id: "all", name: "All Media" },
  { id: "press", name: "Press Releases" },
  { id: "news", name: "News Coverage" },
  { id: "videos", name: "Videos" },
  { id: "podcasts", name: "Podcasts" },
  { id: "interviews", name: "Interviews" }
];

const mediaItems = [
  {
    id: 1,
    title: "Claimsutra CEO Discusses Insurance Claim Challenges on Business Today",
    date: "May 10, 2025",
    type: "interviews",
    source: "Business Today",
    excerpt: "Our CEO shares insights on common challenges faced by consumers when filing insurance claims and how Claimsutra is addressing these issues.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 2,
    title: "Claimsutra Expands Operations to Five New Cities",
    date: "April 28, 2025",
    type: "press",
    source: "Claimsutra Press",
    excerpt: "Claimsutra announces expansion to Pune, Ahmedabad, Kolkata, Jaipur, and Chandigarh as part of its nationwide growth strategy.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 3,
    title: "Understanding Insurance Claim Denials - Expert Analysis",
    date: "April 22, 2025",
    type: "videos",
    source: "Claimsutra YouTube",
    excerpt: "Our legal experts break down the most common reasons for insurance claim denials and provide actionable advice for consumers.",
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=500",
    duration: "15:24"
  },
  {
    id: 4,
    title: "Claimsutra Featured in Economic Times for Innovative Claim Solutions",
    date: "April 15, 2025",
    type: "news",
    source: "Economic Times",
    excerpt: "Economic Times highlights Claimsutra's innovative approach to insurance claim management and its impact on consumer satisfaction.",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 5,
    title: "The Future of Insurance Claims - Podcast Episode",
    date: "April 8, 2025",
    type: "podcasts",
    source: "Insurance Insights Podcast",
    excerpt: "Our CTO discusses how technology is transforming the insurance claim process and what consumers can expect in the coming years.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=500",
    duration: "42:10"
  },
  {
    id: 6,
    title: "Claimsutra Partners with Legal Aid Society for Pro Bono Services",
    date: "April 2, 2025",
    type: "press",
    source: "Claimsutra Press",
    excerpt: "New partnership aims to provide free claim assistance services to economically disadvantaged individuals across India.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=500"
  }
];

export default function MediaPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Media Center</h1>
      
      <p className="text-lg mb-8">
        Welcome to the Claimsutra Media Center. Here you'll find our latest press releases, news coverage, videos, podcasts, and interviews. Stay updated with our company news and industry insights.
      </p>
      
      {/* Category Filter */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {mediaCategories.map((category, index) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                index === 0 
                  ? 'bg-primary text-white' 
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaItems.map((item) => (
          <div key={item.id} className="bg-card rounded-lg overflow-hidden shadow-md">
            <div className="h-48 overflow-hidden relative">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              />
              {(item.type === 'videos' || item.type === 'podcasts') && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {item.duration}
                </div>
              )}
              {item.type === 'videos' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-primary/80 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              )}
              {item.type === 'podcasts' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-primary/80 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 017.072 0m-9.9-2.828a9 9 0 0112.728 0" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </span>
                <span className="text-sm text-muted-foreground">{item.date}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">Source: {item.source}</p>
              <p className="mb-4">{item.excerpt}</p>
              <Button variant="outline">View Full {item.type === 'videos' ? 'Video' : item.type === 'podcasts' ? 'Episode' : 'Article'}</Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Media Contact Section */}
      <div className="mt-12 bg-primary/10 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Media Contact</h2>
        <p className="mb-6">
          For media inquiries, interview requests, or press information, please contact our media relations team.
        </p>
        <div className="md:flex items-start gap-8">
          <div>
            <p className="font-medium">Media Relations Department</p>
            <p>Email: media@claimsutra.com</p>
            <p>Phone: +91-8630959445</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>Download Press Kit</Button>
          </div>
        </div>
      </div>
    </div>
  );
}