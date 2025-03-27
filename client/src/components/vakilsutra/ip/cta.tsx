import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function IPCTA() {
  const scrollToComplaintSection = () => {
    const complaintSection = document.getElementById("complaint-section");
    if (complaintSection) {
      complaintSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-blue-600 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Protect Your Intellectual Property Today
          </h2>
          <p className="text-lg text-white/90 max-w-3xl mx-auto mb-8">
            Don't let your innovations and creative works go unprotected. Our expert team is ready to help you secure your intellectual property rights.
          </p>
          <Button
            onClick={scrollToComplaintSection}
            className="bg-white text-blue-600 hover:bg-white/90 px-8 py-3 rounded-full text-lg font-semibold"
          >
            File Your IP Complaint
          </Button>
        </motion.div>
      </div>
    </div>
  );
} 