import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Fight for Your Consumer Rights",
    subtitle: "Expert legal assistance for all your consumer complaints",
    image: "/consumer.jpg"
  },
  {
    title: "Get Justice for Unfair Practices",
    subtitle: "Stand up against defective products and services",
    image: "/consumer.jpgg"
  },
  {
    title: "Professional Legal Support",
    subtitle: "Dedicated team of consumer law experts",
    image: "/consumer.jpg"
  }
];

export default function ConsumerHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

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
            {/* Fixed Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${slides[0].image})`,
                backgroundPosition: "center 40%", 
                filter: 'brightness(0.85)'
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
            </div>
            
            {/* Stylish overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 mix-blend-overlay" />
            
            {/* Content Container */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-white"
                  >
                    <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-white/90">
                      {slides[currentSlide].title}
                    </h1>
                    <p className="text-sm md:text-base lg:text-lg text-white/75">
                      {slides[currentSlide].subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index);
                      setIsAutoPlaying(false);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? "bg-white w-4" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 