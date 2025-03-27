import React from "react";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    id: 1,
    title: "Understanding Health Insurance Claims: A Complete Guide",
    date: "May 12, 2025",
    author: "Priya Sharma",
    category: "Health Insurance",
    excerpt: "Navigate the complex world of health insurance claims with our comprehensive guide covering everything from documentation to follow-ups.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 2,
    title: "5 Common Mistakes to Avoid When Filing Motor Insurance Claims",
    date: "May 5, 2025",
    author: "Rahul Verma",
    category: "Motor Insurance",
    excerpt: "Learn about the most common pitfalls that can delay or reduce your motor insurance claim settlements and how to avoid them.",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 3,
    title: "New Insurance Regulations in 2025: What You Need to Know",
    date: "April 28, 2025",
    author: "Aditya Patel",
    category: "Insurance News",
    excerpt: "Stay informed about the latest regulatory changes in the insurance industry and how they might affect your policies and claims.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 4,
    title: "How to Document Property Damage for Insurance Claims",
    date: "April 20, 2025",
    author: "Neha Gupta",
    category: "Property Insurance",
    excerpt: "A step-by-step guide to properly documenting property damage to ensure a smooth and successful insurance claim process.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 5,
    title: "The Digital Transformation of Insurance Claims Processing",
    date: "April 15, 2025",
    author: "Vikram Singh",
    category: "Technology",
    excerpt: "Explore how technology is revolutionizing the insurance claims process and making it more efficient and user-friendly.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 6,
    title: "Insurance Claim Denied? Here's What to Do Next",
    date: "April 8, 2025",
    author: "Ananya Desai",
    category: "Claim Assistance",
    excerpt: "Don't give up if your insurance claim is denied. Follow these steps to appeal the decision and increase your chances of approval.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=500"
  }
];

const categories = [
  "All Categories",
  "Health Insurance",
  "Motor Insurance",
  "Property Insurance",
  "Life Insurance",
  "Travel Insurance",
  "Insurance News",
  "Claim Assistance",
  "Technology"
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="md:w-3/4">
          {/* Category Filter */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    index === 0 
                      ? 'bg-primary text-white' 
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-card rounded-lg overflow-hidden shadow-md">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded mr-2">
                      {post.category}
                    </span>
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">By {post.author}</p>
                  <p className="mb-4">{post.excerpt}</p>
                  <Button variant="outline">Read More</Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="bg-primary text-white">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="md:w-1/4">
          {/* Search */}
          <div className="bg-card p-6 rounded-lg shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4">Search</h3>
            <div className="relative">
              <input 
                type="search" 
                placeholder="Search blog posts..." 
                className="w-full p-2 pl-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Popular Posts */}
          <div className="bg-card p-6 rounded-lg shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4">Popular Posts</h3>
            <div className="space-y-4">
              {blogPosts.slice(0, 3).map((post) => (
                <div key={post.id} className="flex gap-3">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm line-clamp-2">{post.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Newsletter */}
          <div className="bg-primary/10 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-sm mb-4">Get the latest insurance insights and claim tips delivered to your inbox.</p>
            <input 
              type="email" 
              placeholder="Your email address" 
              className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button className="w-full">Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
}