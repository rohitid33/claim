import React from "react";
import { motion } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Shield, Copyright, FileText } from "lucide-react";

const banners = [
  {
    title: "Patent Protection",
    subtitle: "Secure your inventions with expert patent filing and protection services",
    image: "/banner.jpg",
    icon: Shield
  },
  {
    title: "Copyright Registration",
    subtitle: "Protect your creative works with copyright registration and enforcement",
    image: "/banner.jpg",
    icon: Copyright
  },
  {
    title: "Trademark Services",
    subtitle: "Register and protect your brand identity with trademark services",
    image: "/banner.jpg",
    icon: FileText
  }
];

export default function IPBanners() {
  return (
    <div className="container mx-auto px-2 sm:px-4 mt-8 md:mt-12">
      <ScrollArea className="w-full overflow-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="flex gap-4 sm:gap-6 pb-4 overflow-x-auto overflow-y-hidden" style={{ scrollBehavior: 'smooth', willChange: 'transform' }}>
          {banners.map((banner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer min-w-[280px] sm:min-w-[300px] md:min-w-[400px] lg:min-w-[500px] flex-shrink-0"
            >
              <div className="relative h-[20vh] md:h-[250px]">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <banner.icon className="w-5 h-5" />
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold">{banner.title}</h3>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg opacity-90">{banner.subtitle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
} 