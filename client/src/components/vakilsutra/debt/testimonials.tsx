import React from "react";
import { motion } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Raj S",
    content: "I was drowning in debt from multiple credit cards and personal loans. The constant calls from recovery agents made my life miserable. With the help of your experts, I was able to resolve my loan problems and come out of debt. Now, I am debt-free and can finally breathe easy.",
    image: "/testimonials/raj.jpg"
  },
  {
    name: "Priyanka K",
    content: "I had taken loans to start my business, but due to losses, I couldn't keep up with the EMIs. Recovery agents started calling and harassing me, which was unbearable. Seeking help from experts was a game-changer. They understood my situation and provided a customized solution.",
    image: "/testimonials/priyanka.jpg"
  },
  {
    name: "Arjun",
    content: "Thanks to the Expert Panel team for resolving my loan problems, especially the harassment calls from recovery agents. The constant harassment was affecting my mental health. Reaching out to you was the best decision I made.",
    image: "/testimonials/arjun.jpg"
  },
  {
    name: "Vikram",
    content: "After an unexpected medical emergency, I found myself buried in debt. I wanted to get out of this situation as soon as possible. Getting help from Expert Panel was the turning point. My advisor stopped the harassment calls and helped me resolve my loan problem.",
    image: "/testimonials/vikram.jpg"
  },
  {
    name: "Amir J",
    content: "I am very thankful to the Expert Panel team for resolving my loan problems. After losing my job, I was unable to pay my credit card bills, and recovery agents were calling and harassing me. But with the help of Expert Panel, I am now debt-free in less than 18 months.",
    image: "/testimonials/amir.jpg"
  }
];

export default function DebtTestimonials() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4"
          >
            Success Stories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Read how we've helped thousands of people achieve financial freedom and peace of mind.
          </motion.p>
        </div>

        <ScrollArea className="w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex gap-6 pb-4">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="min-w-[300px] sm:min-w-[400px] bg-card rounded-xl p-6 shadow-lg flex-shrink-0"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>
    </section>
  );
} 