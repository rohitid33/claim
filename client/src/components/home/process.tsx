import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { IndianRupee, Monitor, Scale, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Process() {
  const [activeTab, setActiveTab] = useState('why');
  const [activeStep, setActiveStep] = useState(0);
  const [lineWidth, setLineWidth] = useState("0%");
  const [mobileLineHeight, setMobileLineHeight] = useState("0%");
  const isMounted = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Define process steps
  const processSteps = [
    {
      id: 1,
      title: "Reach out to us",
      description: "You can reach out to us by raising a ticket here or calling us directly at 86309 59445. Our Claims expert will contact you within half an hour."
    },
    {
      id: 2,
      title: "Share documents",
      description: "Share copies of case-related documents."
    },
    {
      id: 3,
      title: "Case Acceptance",
      description: "We review your case particulars and merits."
    },
    {
      id: 4,
      title: "Registration",
      description: "Registration is absolutely free."
    },
    {
      id: 5,
      title: "Resolution",
      description: "Upon resolution of the complaint, you will need to pay a success fee of 10% + GST."
    }
  ];

  // Set up component mount state
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle step transitions
  useEffect(() => {
    if (!isMounted.current || activeTab !== 'process') return;

    // Calculate line width based on current step
    const percentage = (activeStep / (processSteps.length - 1)) * 100;
    setLineWidth(`${percentage}%`);
    setMobileLineHeight(`${percentage}%`);

    // Schedule next step
    if (activeStep < processSteps.length - 1) {
      timeoutRef.current = setTimeout(() => {
        if (isMounted.current && activeTab === 'process') {
          setActiveStep(prev => prev + 1);
        }
      }, 800);
    } else {
      // Reset after reaching the end
      timeoutRef.current = setTimeout(() => {
        if (isMounted.current && activeTab === 'process') {
          setActiveStep(0);
        }
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeStep, activeTab, processSteps.length]);

  // Start animation when tab changes to process
  useEffect(() => {
    if (activeTab === 'process') {
      setActiveStep(0);
    }
  }, [activeTab]);

  // Features for "Why Choose Us" tab
  const features = [
    {
      icon: <IndianRupee className="w-6 h-6" />,
      title: "No Win, No Fee",
      description: "Pay only a 10% fee on successful claims"
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Professional Legal Experts",
      description: "Access a network of 1000+ legal experts"
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Easy Dashboard",
      description: "Easily track your service requests"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Support",
      description: "Get responses within minutes with robust customer support"
    }
  ];

  // Stats for "Why Choose Us" tab
  const stats = [
    { 
      value: "1800+", 
      label: "Resolved Insurance Claims" 
    },
    { 
      value: "30Cr+", 
      label: "Worth Claim Amount" 
    },
    { 
      value: "1500+", 
      label: "Happy Customers across India" 
    },
    { 
      value: "1000+", 
      label: "Strong Partner Network" 
    }
  ];

  const scrollToCategories = () => {
    const categoriesSection = document.getElementById('categories-section');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 md:py-16 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4">
        {/* Tab selection */}
        <div className="flex gap-1 p-1 bg-primary/5 rounded-lg max-w-fit mx-auto mb-6">
          <Button 
            variant={activeTab === 'why' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('why')}
            className="w-32 rounded-lg text-sm"
          >
            Why Choose Us
          </Button>
          <Button 
            variant={activeTab === 'process' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('process')}
            className="w-32 rounded-lg text-sm"
          >
            Our Process
          </Button>
        </div>
        
        <div className="text-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-1">How We Work</h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Our streamlined process ensures efficient and transparent support.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 mx-auto max-w-5xl">
          <div className="p-3 md:p-5">
            {/* Process Tab Content */}
            {activeTab === 'process' && (
              <div className="animate-fadeIn">
                {/* Desktop Process Steps */}
                <div className="hidden md:block">
                  <div className="flex justify-between items-start relative mb-6 mt-6">
                    {/* Background line */}
                    <div className="absolute top-7 left-0 right-0 h-1 bg-primary/20"></div>
                    
                    {/* Animated progress line */}
                    <div 
                      className="absolute top-7 left-0 h-1 bg-primary z-10"
                      style={{ 
                        width: lineWidth,
                        transition: "width 0.8s ease-in-out"
                      }}
                    />
                    
                    {/* Step circles */}
                    {processSteps.map((step, index) => (
                      <div key={step.id} className="relative flex flex-col items-center text-center w-1/5 px-3">
                        <div 
                          className={`w-14 h-14 rounded-full flex items-center justify-center font-bold z-20 mb-4 transition-all duration-500 ${
                            index <= activeStep 
                              ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                              : 'bg-primary/20 text-primary/70'
                          } ${
                            index === activeStep ? 'scale-110' : 'scale-100'
                          }`}
                        >
                          <span className="text-lg">{step.id}</span>
                        </div>
                        <h3 className={`text-base font-semibold mb-2 transition-colors duration-500 ${
                          index <= activeStep ? 'text-primary' : 'text-gray-600'
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Mobile Process Steps */}
                <div className="md:hidden space-y-5 mt-4 relative">
                  {/* Background line */}
                  <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-primary/20"></div>
                  
                  {/* Animated progress line */}
                  <div 
                    className="absolute left-5 top-6 w-0.5 bg-primary z-10"
                    style={{ 
                      height: mobileLineHeight,
                      transition: "height 0.8s ease-in-out"
                    }}
                  />
                  
                  {/* Step circles */}
                  {processSteps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-4">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 z-20 transition-all duration-500 ${
                          index <= activeStep 
                            ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                            : 'bg-primary/20 text-primary/70'
                        } ${
                          index === activeStep ? 'scale-110' : 'scale-100'
                        }`}
                      >
                        {step.id}
                      </div>
                      <div>
                        <h3 className={`text-base font-semibold mb-1 transition-colors duration-500 ${
                          index <= activeStep ? 'text-primary' : 'text-gray-600'
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why Choose Us Tab Content */}
            {activeTab === 'why' && (
              <div className="animate-fadeIn">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {features.map((feature, index) => (
                    <div 
                      key={index}
                      className="bg-primary/5 p-3 rounded-lg"
                      style={{
                        animation: `fadeInUp 0.3s ease-out ${index * 0.1}s forwards`
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          {feature.icon}
                        </div>
                        <h3 className="text-sm font-semibold">{feature.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-primary/5 rounded-lg p-4 mt-6">
                  <h3 className="text-sm font-semibold text-center mb-4">Our Impact</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                      <div 
                        key={index}
                        className="text-center"
                        style={{
                          animation: `fadeInScale 0.3s ease-out ${index * 0.1}s forwards`
                        }}
                      >
                        <div className="text-xl font-bold text-primary mb-1">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button size="sm" className="px-6" onClick={scrollToCategories}>
                    Start Your Claim
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}