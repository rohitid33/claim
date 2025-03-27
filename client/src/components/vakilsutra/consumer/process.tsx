import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Scale, FileText, Gavel, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ConsumerProcess() {
  const [activeTab, setActiveTab] = useState('why');
  const [activeStep, setActiveStep] = useState(0);
  const [lineWidth, setLineWidth] = useState("0%");
  const [mobileLineHeight, setMobileLineHeight] = useState("0%");
  const isMounted = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const processSteps = [
    {
      id: 1,
      title: "File Your Complaint",
      description: "Submit your consumer complaint with all relevant documents and details."
    },
    {
      id: 2,
      title: "Case Review",
      description: "Our legal experts review your case and assess its merits."
    },
    {
      id: 3,
      title: "Legal Strategy",
      description: "We develop a comprehensive legal strategy for your case."
    },
    {
      id: 4,
      title: "Court Proceedings",
      description: "Our lawyers represent you in consumer court proceedings."
    },
    {
      id: 5,
      title: "Resolution",
      description: "We work towards a favorable resolution and compensation."
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
    if (!isMounted.current || activeTab !== 'process') return;

    const percentage = (activeStep / (processSteps.length - 1)) * 100;
    setLineWidth(`${percentage}%`);
    setMobileLineHeight(`${percentage}%`);

    if (activeStep < processSteps.length - 1) {
      timeoutRef.current = setTimeout(() => {
        if (isMounted.current && activeTab === 'process') {
          setActiveStep(prev => prev + 1);
        }
      }, 800);
    } else {
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

  useEffect(() => {
    if (activeTab === 'process') {
      setActiveStep(0);
    }
  }, [activeTab]);

  const features = [
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Expert Legal Team",
      description: "Access to experienced consumer law specialists"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Documentation Support",
      description: "Help with preparing all necessary legal documents"
    },
    {
      icon: <Gavel className="w-6 h-6" />,
      title: "Court Representation",
      description: "Professional representation in consumer courts"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Resolution",
      description: "Efficient handling of consumer complaints"
    }
  ];

  const stats = [
    { 
      value: "500+", 
      label: "Consumer Cases Won" 
    },
    { 
      value: "₹2Cr+", 
      label: "Compensation Recovered" 
    },
    { 
      value: "1000+", 
      label: "Happy Clients" 
    },
    { 
      value: "95%", 
      label: "Success Rate" 
    }
  ];

  const scrollToComplaint = () => {
    const complaintSection = document.getElementById('complaint-section');
    if (complaintSection) {
      complaintSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 md:py-16 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4">
        <div className="flex gap-1 p-1 bg-blue-600/5 rounded-lg max-w-fit mx-auto mb-6">
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
          <h2 className="text-2xl md:text-3xl font-bold mb-1">How We Handle Your Case</h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Our streamlined process ensures efficient resolution of your consumer complaints.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 mx-auto max-w-5xl">
          <div className="p-3 md:p-5">
            {activeTab === 'process' && (
              <div className="animate-fadeIn">
                <div className="hidden md:block">
                  <div className="flex justify-between items-start relative mb-6 mt-6">
                    <div className="absolute top-7 left-0 right-0 h-1 bg-blue-600/20"></div>
                    <div 
                      className="absolute top-7 left-0 h-1 bg-blue-600 z-10"
                      style={{ 
                        width: lineWidth,
                        transition: "width 0.8s ease-in-out"
                      }}
                    />
                    
                    {processSteps.map((step, index) => (
                      <div key={step.id} className="relative flex flex-col items-center text-center w-1/5 px-3">
                        <div 
                          className={`w-14 h-14 rounded-full flex items-center justify-center font-bold z-20 mb-4 transition-all duration-500 ${
                            index <= activeStep 
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                              : 'bg-blue-600/20 text-blue-600/70'
                          } ${
                            index === activeStep ? 'scale-110' : 'scale-100'
                          }`}
                        >
                          <span className="text-lg">{step.id}</span>
                        </div>
                        <h3 className={`text-base font-semibold mb-2 transition-colors duration-500 ${
                          index <= activeStep ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="md:hidden space-y-5 mt-4 relative">
                  <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-blue-600/20"></div>
                  <div 
                    className="absolute left-5 top-6 w-0.5 bg-blue-600 z-10"
                    style={{ 
                      height: mobileLineHeight,
                      transition: "height 0.8s ease-in-out"
                    }}
                  />
                  
                  {processSteps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-4">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 z-20 transition-all duration-500 ${
                          index <= activeStep 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                            : 'bg-blue-600/20 text-blue-600/70'
                        } ${
                          index === activeStep ? 'scale-110' : 'scale-100'
                        }`}
                      >
                        {step.id}
                      </div>
                      <div>
                        <h3 className={`text-base font-semibold mb-1 transition-colors duration-500 ${
                          index <= activeStep ? 'text-blue-600' : 'text-gray-600'
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

            {activeTab === 'why' && (
              <div className="animate-fadeIn">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {features.map((feature, index) => (
                    <div 
                      key={index}
                      className="bg-blue-600/5 p-3 rounded-lg"
                      style={{
                        animation: `fadeInUp 0.3s ease-out ${index * 0.1}s forwards`
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-600">
                          {feature.icon}
                        </div>
                        <h3 className="text-sm font-semibold">{feature.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-600/5 rounded-lg p-4 mt-6">
                  <h3 className="text-sm font-semibold text-center mb-4">Our Track Record</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                      <div 
                        key={index}
                        className="text-center"
                        style={{
                          animation: `fadeInScale 0.3s ease-out ${index * 0.1}s forwards`
                        }}
                      >
                        <div className="text-xl font-bold text-blue-600 mb-1">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button size="sm" className="px-6" onClick={scrollToComplaint}>
                    File Your Complaint
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