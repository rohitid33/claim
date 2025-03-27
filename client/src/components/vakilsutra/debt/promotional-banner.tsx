import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const benefits = [
  "Save up to 50% on your total outstanding debt",
  "Stop harassment calls from recovery agents",
  "Expert guidance throughout the process",
  "Legal compliance with RBI guidelines"
];

export default function DebtPromotionalBanner() {
  return (
    <section className="py-12">
      <div className="relative overflow-hidden rounded-3xl bg-primary">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50" />
          <img
            src="/images/debt-promo.jpg"
            alt="Debt Relief"
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
              Break Free from Debt Today
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white/90 mb-8"
            >
              Join thousands of people who have achieved financial freedom through our proven debt relief programs.
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