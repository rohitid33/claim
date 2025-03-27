import React from "react";
import { motion } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    position: "CEO, TechStart Solutions",
    content: "The team helped us register our private limited company smoothly. Their expertise in corporate law and attention to detail made the process hassle-free.",
    image: "/testimonials/rajesh.jpg"
  },
  {
    name: "Priya Sharma",
    position: "Founder, Green Earth NGO",
    content: "We registered our NGO with their guidance. Their knowledge of compliance requirements and dedication to helping social enterprises is commendable.",
    image: "/testimonials/priya.jpg"
  },
  {
    name: "Amit Patel",
    position: "Managing Partner, Patel & Associates",
    content: "The LLP registration process was completed efficiently. Their team's understanding of business structures and legal requirements is impressive.",
    image: "/testimonials/amit.jpg"
  },
  {
    name: "Neha Gupta",
    position: "Director, Innovation Labs",
    content: "Their assistance in setting up our startup was invaluable. They not only handled the registration but also provided valuable insights for future compliance.",
    image: "/testimonials/neha.jpg"
  }
];

export default function CorporateTestimonials() {
  return (
    <section className="py-12 md:py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-blue-900/80 max-w-2xl mx-auto">
            Success stories from businesses we've helped incorporate
          </p>
        </div>

        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex w-max space-x-4 p-4">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-[350px] flex-shrink-0 bg-white rounded-xl p-6 shadow-sm border border-blue-100"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-950">{testimonial.name}</h3>
                    <p className="text-sm text-blue-900/60">{testimonial.position}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-blue-900/80">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
} 