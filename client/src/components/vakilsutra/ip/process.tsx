import React from "react";
import { motion } from "framer-motion";
import { FileText, Search, Shield, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Document Submission",
    description: "Submit your IP documents and details through our secure platform"
  },
  {
    icon: Search,
    title: "Initial Assessment",
    description: "Our experts review your IP case and determine the best course of action"
  },
  {
    icon: Shield,
    title: "Protection Strategy",
    description: "We develop a comprehensive strategy to protect your intellectual property"
  },
  {
    icon: CheckCircle,
    title: "Registration & Enforcement",
    description: "Complete the registration process and enforce your IP rights"
  }
];

export default function IPProcess() {
  return (
    <div className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
            Our IP Protection Process
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Follow our streamlined process to protect your intellectual property rights effectively
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-950 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 