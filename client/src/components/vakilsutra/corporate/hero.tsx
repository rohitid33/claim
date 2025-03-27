import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CorporateHero() {
  const scrollToServices = () => {
    const serviceSection = document.getElementById('service-section');
    if (serviceSection) {
      serviceSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden rounded-2xl">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/80 z-10" />
        <img
          src="/images/corporate-hero.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Start Your Business Journey
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Expert guidance for business registration, compliance, and legal documentation.
              Get started with the right business structure for your venture.
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-900 hover:bg-white/90"
              onClick={scrollToServices}
            >
              Explore Our Services
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 z-10"
      >
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
            fill="white"
          />
        </svg>
      </motion.div>
    </section>
  );
} 