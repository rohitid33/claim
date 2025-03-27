import React from "react";
import { Button } from "@/components/ui/button";

const upcomingEvents = [
  {
    id: 1,
    title: "Insurance Awareness Workshop",
    date: "June 15, 2025",
    location: "Chennai, Tamil Nadu",
    description: "Learn about your insurance rights and how to file claims effectively.",
    image: "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 2,
    title: "Legal Aid Camp",
    date: "July 10, 2025",
    location: "Mumbai, Maharashtra",
    description: "Free legal consultation for insurance claim disputes and consumer issues.",
    image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 3,
    title: "Digital Insurance Conference",
    date: "August 22, 2025",
    location: "Bangalore, Karnataka",
    description: "Exploring the future of insurance in the digital age and how it affects consumers.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=500"
  }
];

const pastEvents = [
  {
    id: 4,
    title: "Consumer Rights Seminar",
    date: "April 5, 2025",
    location: "Delhi, NCR",
    description: "Educational seminar on consumer rights in insurance and financial services.",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 5,
    title: "Health Insurance Workshop",
    date: "March 12, 2025",
    location: "Hyderabad, Telangana",
    description: "Workshop focused on understanding health insurance policies and claims.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=500"
  }
];

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="bg-card rounded-lg overflow-hidden shadow-md">
              <div className="h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <div className="flex items-center text-muted-foreground mb-2">
                  <span className="mr-4">{event.date}</span>
                  <span>{event.location}</span>
                </div>
                <p className="mb-4">{event.description}</p>
                <div className="flex justify-between items-center">
                  <Button variant="outline">Learn More</Button>
                  <Button>Register</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-6">Past Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents.map((event) => (
            <div key={event.id} className="bg-card rounded-lg overflow-hidden shadow-md">
              <div className="h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300 grayscale"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <div className="flex items-center text-muted-foreground mb-2">
                  <span className="mr-4">{event.date}</span>
                  <span>{event.location}</span>
                </div>
                <p className="mb-4">{event.description}</p>
                <Button variant="outline" className="w-full">View Highlights</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="mt-12 bg-primary/10 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Host an Event with Us</h2>
        <p className="mb-6">
          Interested in hosting an insurance awareness or legal aid event in your community? 
          Partner with Claimsutra to organize educational workshops and seminars.
        </p>
        <Button>Contact Our Events Team</Button>
      </section>
    </div>
  );
}