import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// Banner content
const banners = [
  {
    title: "Expert Insurance Support",
    subtitle: "We help you navigate through complex insurance claims",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=100"
  },
  {
    title: "Fast Claim Resolution",
    subtitle: "Quick and efficient resolution for your insurance disputes",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1920&q=100"
  },
  {
    title: "Professional Assistance",
    subtitle: "Expert team ready to support your insurance needs",
    image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1920&q=100"
  }
];

export default function HeroBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const currentBannerContent = banners[currentBanner];
  
  // Use the banner image from public directory
  const bannerImage = "/banner.jpg";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-4 py-2 md:px-4 md:py-4">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="
            relative h-[20vh] md:h-[250px] rounded-2xl overflow-hidden w-full md:w-[calc(33.333%-1rem)]
            shadow-[0_8px_30px_rgb(0,0,0,0.12)]
            border border-white/10
            bg-gradient-to-r from-primary/5 via-background to-primary/5
          ">
            {/* Fixed background image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url("${bannerImage}")`,
                backgroundPosition: "center 40%", 
                filter: 'brightness(0.85)'
              }}
            />
            
            {/* Stylish overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 mix-blend-overlay" />
            
            {/* Content container */}
            <div className="relative h-full flex flex-col justify-center">
              {/* Text content - changes with timer */}
              <div className="px-4">
                <div className="max-w-2xl text-white">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`banner-${currentBanner}-text`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="p-3 md:p-4 lg:p-6"
                    >
                      <div>
                        <div className="mb-1 md:mb-2">
                          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-white/90">
                            {currentBannerContent.title}
                          </h1>
                        </div>
                        <p className="text-sm md:text-base lg:text-lg text-white/75">
                          {currentBannerContent.subtitle}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}