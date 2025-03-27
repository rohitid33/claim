import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Users, FileCheck, Heart } from "lucide-react";

const expertiseAreas = [
  {
    icon: Shield,
    title: "Loan Resolution",
    description: "Expert guidance to resolve your loan issues and become debt-free through our proven process."
  },
  {
    icon: Users,
    title: "Anti-Harassment Service",
    description: "Stop recovery agent harassment with our specialized AHS program that follows RBI guidelines."
  },
  {
    icon: FileCheck,
    title: "Debt Settlement",
    description: "Negotiate better terms and reduce your debt burden significantly with our expert team."
  }
];

const approachPoints = [
  {
    icon: Heart,
    title: "Empathy First",
    description: "We understand your financial situation and provide personalized solutions that work for you."
  },
  {
    icon: Shield,
    title: "Legal Compliance",
    description: "All our solutions are within legal frameworks and follow RBI guidelines."
  },
  {
    icon: Users,
    title: "Expert Support",
    description: "Our dedicated team of experts provides continuous support throughout your debt-free journey."
  }
];

export default function DebtAboutUs() {
  const scrollToServices = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4"
          >
            Your Trusted Partner in Debt Relief
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            We specialize in helping individuals and businesses resolve their debt issues through expert guidance and personalized solutions.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {expertiseAreas.map((area, index) => {
            const Icon = area.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-lg"
              >
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{area.title}</h3>
                <p className="text-muted-foreground">{area.description}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approachPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-lg"
              >
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                <p className="text-muted-foreground">{point.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            onClick={scrollToServices}
          >
            Start Your Debt-Free Journey
          </Button>
        </motion.div>
      </div>
    </section>
  );
} 