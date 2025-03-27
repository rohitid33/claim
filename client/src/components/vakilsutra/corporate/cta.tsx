import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CorporateCTA() {
  return (
    <section className="py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/90 to-primary">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,0,0,0.2),transparent)]" />
          <img
            src="/images/corporate-cta.jpg"
            alt="Start your business"
            className="w-full h-full object-cover opacity-10"
          />
        </div>

        <div className="relative px-6 py-16 sm:px-12 lg:px-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            Ready to Start Your Business?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/90 mb-8 max-w-2xl mx-auto"
          >
            Take the first step towards your entrepreneurial journey. Our experts are here to guide you through every step of the business registration process.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant="secondary"
              size="lg"
              className="min-w-[200px]"
              onClick={() => {
                const servicesSection = document.getElementById("services");
                if (servicesSection) {
                  servicesSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Get Started Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="min-w-[200px] bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => window.location.href = "/vakilsutra/corporate/consultation"}
            >
              Schedule Consultation
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-white/80 text-sm mt-8"
          >
            Join thousands of successful businesses who trusted us with their registration
          </motion.p>
        </div>
      </div>
    </section>
  );
} 