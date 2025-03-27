import React from "react";
import { Button } from "@/components/ui/button";

const featuredNews = {
  id: 1,
  title: "Claimsutra Launches New Digital Platform for Faster Claim Processing",
  date: "May 15, 2025",
  category: "Company News",
  excerpt: "Claimsutra introduces a revolutionary digital platform that reduces insurance claim processing time by up to 60%, helping customers get their settlements faster.",
  image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
};

const newsItems = [
  {
    id: 2,
    title: "New Insurance Regulations to Benefit Consumers",
    date: "May 10, 2025",
    category: "Industry News",
    excerpt: "Recent regulatory changes in the insurance sector aim to simplify claim processes and increase transparency for consumers.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 3,
    title: "Claimsutra Expands Operations to Five New Cities",
    date: "April 28, 2025",
    category: "Company News",
    excerpt: "As part of its nationwide expansion, Claimsutra opens new offices in Pune, Ahmedabad, Kolkata, Jaipur, and Chandigarh.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 4,
    title: "Study Shows 40% of Insurance Claims are Initially Underpaid",
    date: "April 15, 2025",
    category: "Research",
    excerpt: "A new study conducted by Claimsutra reveals that a significant percentage of insurance claims are initially underpaid, highlighting the need for expert assistance.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 5,
    title: "Claimsutra Partners with Legal Aid Society for Pro Bono Services",
    date: "April 5, 2025",
    category: "Partnerships",
    excerpt: "New partnership aims to provide free claim assistance services to economically disadvantaged individuals across India.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 6,
    title: "Digital Insurance Claims Expected to Grow by 200% in Next Five Years",
    date: "March 22, 2025",
    category: "Industry Trends",
    excerpt: "Industry report predicts massive growth in digital claim filing and processing, with mobile-first solutions leading the way.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=500"
  }
];

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">News & Updates</h1>
      
      {/* Featured News */}
      <div className="bg-card rounded-lg overflow-hidden shadow-md mb-12">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              src={featuredNews.image} 
              alt={featuredNews.title} 
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="p-6 md:w-1/2 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-2">
                <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded mr-2">
                  {featuredNews.category}
                </span>
                <span className="text-sm text-muted-foreground">{featuredNews.date}</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">{featuredNews.title}</h2>
              <p className="mb-6">{featuredNews.excerpt}</p>
            </div>
            <Button>Read Full Story</Button>
          </div>
        </div>
      </div>
      
      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsItems.map((item) => (
          <div key={item.id} className="bg-card rounded-lg overflow-hidden shadow-md">
            <div className="h-48 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center mb-2">
                <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded mr-2">
                  {item.category}
                </span>
                <span className="text-sm text-muted-foreground">{item.date}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="mb-4">{item.excerpt}</p>
              <Button variant="outline">Read More</Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Newsletter Signup */}
      <div className="mt-12 bg-primary/10 p-8 rounded-lg">
        <div className="md:flex items-center justify-between">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-semibold mb-2">Stay Updated</h2>
            <p>Subscribe to our newsletter to receive the latest news, updates, and insights about insurance claims and legal matters.</p>
          </div>
          <div className="md:w-1/3 flex">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button className="rounded-l-none">Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
}