import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, CheckCircle2 } from "lucide-react";

export default function DebtHero() {
  const scrollToServices = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden rounded-3xl mx-2 sm:mx-4 my-4 sm:my-8">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <img
          src="/images/debt-hero.jpg"
          alt="Debt Relief"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/90 to-blue-800/85" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 sm:mb-6"
          >
            <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-500/20 text-blue-100 text-xs sm:text-sm font-medium backdrop-blur-sm">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              RBI Compliant Debt Relief Solutions
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white leading-tight"
          >
            Break Free from Debt
            <br className="hidden sm:block" />
            <span className="block sm:inline">Start Your Journey to Financial Freedom</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-blue-50 max-w-3xl mx-auto px-4 sm:px-0"
          >
            India's trusted partner in debt relief and loan settlement. We help you break free from the burden of debt with expert guidance and personalized solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4 sm:px-0"
          >
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-full shadow-lg w-full sm:w-auto"
              onClick={scrollToServices}
            >
              Get Started Now
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-full backdrop-blur-sm w-full sm:w-auto border border-white/20"
              onClick={() => window.location.href = "/vakilsutra/debt/consultation"}
            >
              Free Consultation
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto px-4 sm:px-0"
          >
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-blue-50">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span className="text-xs sm:text-sm">RBI Compliant</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-blue-50">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span className="text-xs sm:text-sm">No Hidden Fees</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-blue-50">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span className="text-xs sm:text-sm">Expert Support</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-blue-50">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span className="text-xs sm:text-sm">100% Confidential</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </section>
  );
} 