import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileCheck, PiggyBank, Handshake, Trophy, Heart } from "lucide-react";

const processSteps = [
  {
    id: 1,
    title: "Check Eligibility",
    description: "Our experts evaluate your financial situation and determine the best debt relief program for you.",
    icon: CheckCircle
  },
  {
    id: 2,
    title: "Enrol with Us",
    description: "Sign up for our program and get assigned a dedicated debt resolution expert.",
    icon: FileCheck
  },
  {
    id: 3,
    title: "Save for Resolution",
    description: "Start saving in a Special Purpose Account (SPA) to build funds for debt settlement.",
    icon: PiggyBank
  },
  {
    id: 4,
    title: "Negotiate with Bank",
    description: "Our experts negotiate with your lenders to reach the best possible settlement terms.",
    icon: Handshake
  },
  {
    id: 5,
    title: "Resolve with Bank",
    description: "Finalize the settlement agreement and complete the debt resolution process.",
    icon: Trophy
  },
  {
    id: 6,
    title: "Become Loan Free",
    description: "Start your new debt-free life with financial freedom and peace of mind.",
    icon: Heart
  }
];

export default function DebtProcess() {
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
            How Loan Resolution Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Our proven 6-step process helps you achieve financial freedom through expert guidance and support.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {step.id < 6 && (
                  <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 hidden lg:block">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                  </div>
                )}
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