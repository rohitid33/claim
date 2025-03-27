import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Scale, FileText, Gavel, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function CorporateProcess() {
  const [activeTab, setActiveTab] = useState('why');
  const [activeStep, setActiveStep] = useState(0);
  const [lineWidth, setLineWidth] = useState("0%");
  const [mobileLineHeight, setMobileLineHeight] = useState("0%");
  const isMounted = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const processSteps = [
    {
      id: 1,
      title: "Initial Consultation",
      description: "Discuss your business requirements and choose the right entity type."
    },
    {
      id: 2,
      title: "Document Collection",
      description: "Gather and prepare all necessary documents for registration."
    },
    {
      id: 3,
      title: "Name Approval",
      description: "Apply for and obtain approval of your company name."
    },
    {
      id: 4,
      title: "Registration Process",
      description: "Complete the registration process with relevant authorities."
    },
    {
      id: 5,
      title: "Post-Registration",
      description: "Obtain necessary certificates and start your business operations."
    }
  ];

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMounted.current) return;

    const updateProgress = () => {
      if (activeStep < processSteps.length) {
        const progress = (activeStep / (processSteps.length - 1)) * 100;
        setLineWidth(`${progress}%`);
        setMobileLineHeight(`${progress}%`);
      }
    };

    timeoutRef.current = setTimeout(updateProgress, 100);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeStep, processSteps.length]);

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
            Our Business Incorporation Process
          </h2>
          <p className="text-lg text-blue-900/80 max-w-2xl mx-auto">
            We guide you through every step of your business registration journey
          </p>
        </div>

        <div className="relative">
          {/* Desktop Progress Line */}
          <div className="hidden md:block absolute top-8 left-0 w-full h-1 bg-blue-100">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: "0%" }}
              animate={{ width: lineWidth }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Mobile Progress Line */}
          <div className="md:hidden absolute left-8 top-0 w-1 h-full bg-blue-100">
            <motion.div
              className="w-full bg-blue-600"
              initial={{ height: "0%" }}
              animate={{ height: mobileLineHeight }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="space-y-8 md:space-y-0">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex items-start md:items-center gap-4 md:gap-8"
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                    index <= activeStep ? 'bg-blue-600' : 'bg-blue-100'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <span className={`text-lg font-semibold ${
                      index <= activeStep ? 'text-blue-600' : 'text-blue-400'
                    }`}>
                      {step.id}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className={`text-xl font-semibold mb-2 ${
                    index <= activeStep ? 'text-blue-950' : 'text-blue-900/60'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-blue-900/80 ${
                    index <= activeStep ? 'opacity-100' : 'opacity-60'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8">
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