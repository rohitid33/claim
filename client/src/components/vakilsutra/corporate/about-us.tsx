import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Phone, Mail, MapPin, Shield, Target, Users, Clock, CheckCircle2, FileCheck, Headphones, Handshake } from "lucide-react";

const expertiseAreas = [
  {
    icon: Shield,
    title: "Corporate Law Experts",
    description: "Our team of experienced lawyers specializes in business registration and corporate compliance."
  },
  {
    icon: Target,
    title: "Business Registration",
    description: "We handle all aspects of business incorporation with precision and efficiency."
  },
  {
    icon: Users,
    title: "Compliance Support",
    description: "Our dedicated team ensures your business meets all regulatory requirements."
  }
];

const approachPoints = [
  {
    icon: CheckCircle2,
    title: "Transparency",
    description: "Clear communication and regular updates on your registration progress"
  },
  {
    icon: FileCheck,
    title: "Efficiency",
    description: "Streamlined processes and quick turnaround times"
  },
  {
    icon: Headphones,
    title: "Thoroughness",
    description: "Comprehensive analysis and attention to every detail"
  },
  {
    icon: Handshake,
    title: "Support",
    description: "Dedicated assistance throughout your business registration journey"
  }
];

export default function CorporateAboutUs() {
  const scrollToServices = () => {
    const serviceSection = document.getElementById('service-section');
    if (serviceSection) {
      serviceSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-blue-900/80 max-w-2xl mx-auto">
            We provide comprehensive business registration and compliance solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {expertiseAreas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-blue-50 rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <area.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-950 mb-2">{area.title}</h3>
              <p className="text-blue-900/80">{area.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {approachPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <point.icon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-950 mb-1">{point.title}</h3>
                <p className="text-sm text-blue-900/80">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            onClick={scrollToServices}
          >
            Start Your Business Registration
          </Button>
        </div>
      </div>
    </section>
  );
} 