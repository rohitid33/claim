import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const benefits = [
  "Expert guidance throughout the registration process",
  "Complete documentation and compliance support",
  "Dedicated relationship manager",
  "Post-registration support and consultation"
];

export default function CorporatePromotionalBanner() {
  return (
    <section className="py-12">
      <div className="relative overflow-hidden rounded-3xl bg-primary">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50" />
          <img
            src="/images/corporate-promo.jpg"
            alt="Business Registration"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="relative px-6 py-16 sm:px-12 lg:px-16">
          <div className="md:w-3/5">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-white mb-6"
            >
              Start Your Business Journey Today
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white/90 mb-8"
            >
              Get your business registered with our expert assistance. We make the process simple, fast, and hassle-free.
            </motion.p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span className="text-white">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  const servicesSection = document.getElementById("services");
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Get Started Now
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 