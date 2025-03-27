import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Phone, Mail, MapPin, Shield, Target, Users, Clock, CheckCircle2, FileCheck, Headphones, Handshake } from "lucide-react";

const expertiseAreas = [
  {
    icon: Shield,
    title: "Consumer Law Experts",
    description: "Our team of experienced lawyers specializes in consumer protection laws and regulations."
  },
  {
    icon: Target,
    title: "Case Management",
    description: "We handle your case with precision and dedication, ensuring the best possible outcome."
  },
  {
    icon: Users,
    title: "Customer Support",
    description: "Our dedicated support team is always ready to assist you throughout your journey."
  }
];

const approachPoints = [
  {
    icon: CheckCircle2,
    title: "Transparency",
    description: "Clear communication and regular updates on your case progress"
  },
  {
    icon: FileCheck,
    title: "Efficiency",
    description: "Streamlined processes and quick response times"
  },
  {
    icon: Headphones,
    title: "Thoroughness",
    description: "Comprehensive analysis and attention to every detail"
  },
  {
    icon: Handshake,
    title: "Support",
    description: "Dedicated assistance throughout your complaint resolution journey"
  }
];

export default function ConsumerAboutUs() {
  return (
    <div className="bg-gradient-to-b from-white to-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
            Empowering Consumer Rights
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At Vakilsutra, we are committed to protecting your consumer rights and ensuring fair treatment in the marketplace.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-2xl font-semibold text-blue-950 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To provide accessible, efficient, and effective legal solutions for consumer complaints, ensuring justice and fair treatment for all.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-2xl font-semibold text-blue-950 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To be the leading platform for consumer protection, setting new standards in legal service delivery and customer satisfaction.
            </p>
          </motion.div>
        </div>

        {/* Expertise Areas */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-blue-950 mb-8 text-center">Areas of Expertise</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {expertiseAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <area.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-blue-950 mb-2">{area.title}</h4>
                <p className="text-gray-600">{area.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Comprehensive Approach */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-blue-950 mb-8 text-center">Our Comprehensive Approach</h3>
          <ScrollArea className="w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex gap-6 pb-4 overflow-y-visible" style={{ scrollBehavior: 'smooth', willChange: 'transform' }}>
              {approachPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 min-w-[280px] sm:min-w-[300px] group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                    <point.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-blue-950 mb-2">{point.title}</h4>
                  <p className="text-gray-600">{point.description}</p>
                </motion.div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h3 className="text-2xl font-semibold text-blue-950 mb-6 text-center">Get in Touch</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-950">Address</h4>
                <p className="text-gray-600">123 Legal Street, Law District, City, Country</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-950">Phone</h4>
                <p className="text-gray-600">+1 234 567 8900</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-950">Email</h4>
                <p className="text-gray-600">support@vakilsutra.com</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 