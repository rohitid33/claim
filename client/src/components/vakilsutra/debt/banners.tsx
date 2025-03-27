import React from "react";
import { motion } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

const banners = [
  {
    title: "Loan Resolution",
    subtitle: "Expert guidance to resolve your loan issues and become debt-free",
    image: "/banner.jpg"
  },
  {
    title: "Anti-Harassment Service",
    subtitle: "Stop recovery agent harassment with our specialized AHS program",
    image: "/banner.jpg"
  },
  {
    title: "Debt Settlement",
    subtitle: "Negotiate better terms and reduce your debt burden significantly",
    image: "/banner.jpg"
  }
];

export default function DebtBanners() {
  const isMobile = useIsMobile();
  const scrollRef = React.useRef<HTMLDivElement>(null);

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
              className="relative group overflow-hidden rounded-2xl shadow-lg min-w-[280px] sm:min-w-[300px] md:min-w-[400px] lg:min-w-[500px] flex-shrink-0"
            >
              <div className="relative h-[20vh] md:h-[250px]">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2">{banner.title}</h3>
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