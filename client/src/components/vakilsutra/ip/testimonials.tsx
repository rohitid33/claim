import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Innovation Director",
    company: "Tech Innovations Inc.",
    content: "Vakilsutra's IP protection services were exceptional. They helped us secure patents for our groundbreaking technology and provided ongoing support for enforcement.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    role: "Creative Director",
    company: "Design Studio Pro",
    content: "The team's expertise in copyright law helped us protect our creative works effectively. Their guidance was invaluable throughout the process.",
    rating: 5
  },
  {
    name: "Emily Thompson",
    role: "Brand Manager",
    company: "Global Brands Co.",
    content: "Their trademark registration service was seamless. They helped us protect our brand identity across multiple jurisdictions.",
    rating: 5
  }
];

export default function IPTestimonials() {
  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
            Client Testimonials
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from our satisfied clients about their experience with our IP protection services
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
              <div>
                <h4 className="font-semibold text-blue-950">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 