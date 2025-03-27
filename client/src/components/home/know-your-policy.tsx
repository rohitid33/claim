import { useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";

export default function KnowYourPolicy() {
  const [_, setLocation] = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const section = sectionRef.current;
    if (!container || !section || hasScrolledRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start scrolling when section comes into view
            const scrollWidth = container.scrollWidth;
            const clientWidth = container.clientWidth;
            const maxScroll = scrollWidth - clientWidth;
            
            let currentScroll = 0;
            const scrollInterval = setInterval(() => {
              if (currentScroll >= maxScroll) {
                clearInterval(scrollInterval);
                // Reset to start with smooth animation
                container.scrollTo({
                  left: 0,
                  behavior: 'smooth'
                });
                currentScroll = 0;
                setActiveIndex(0);
                hasScrolledRef.current = true;
                // Unobserve after scrolling is complete
                observer.unobserve(entry.target);
              } else {
                currentScroll += 8;
                container.scrollLeft = currentScroll;
              }
            }, 10);
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    observer.observe(section);

    // Update active index based on scroll position
    const handleScroll = () => {
      const scrollPosition = container.scrollLeft;
      const itemWidth = container.clientWidth;
      const newIndex = Math.round(scrollPosition / itemWidth);
      setActiveIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = (url: string) => {
    setLocation(url);
  };

  const services = [
    {
      id: "67d7d0b9ba8af0c60c60b79e",
      title: "Know Your Policy",
      description: "Get detailed insights and understanding of your insurance policy",
      icon: "/icons/car_ins.png",
      url: "/service/know-your-policy",
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "67d7d0b9ba8af0c60c60b79f",
      title: "Mis-selling or Fraud",
      description: "Report issues and file complaints about insurance mis-selling or fraud",
      icon: "/icons/car_ins.png",
      url: "/service/mis-selling-fraud",
      gradient: "from-red-500 to-red-600",
      bgColor: "bg-red-50"
    },
    {
      id: "67d7d0b9ba8af0c60c60b7a0",
      title: "File Your Complaint",
      description: "Submit and track your insurance claims easily",
      icon: "/icons/car_ins.png",
      url: "/service/file-complaint",
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    }
  ];

  return (
    <section ref={sectionRef} className="py-12 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div className="flex gap-2 md:gap-4 pb-4 md:justify-center">
              {services.map((service) => (
                <div 
                  key={service.id}
                  onClick={() => handleClick(service.url)}
                  className="flex flex-col items-center justify-center cursor-pointer group transition-all duration-300 hover:scale-105 w-[calc(100vw-2rem)] md:w-[280px] flex-shrink-0"
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-all duration-200 group-hover:shadow-xl rounded-xl sm:rounded-2xl ${
                    service.bgColor
                  }`}>
                    <img
                      src={service.icon}
                      alt={service.title}
                      className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl sm:rounded-2xl transition-all duration-200 group-hover:shadow-lg`}
                    />
                  </div>
                  <h3 className="text-sm sm:text-base font-medium text-blue-950 text-center group-hover:text-blue-800 transition-colors duration-200 px-4 relative mt-3 sm:mt-4">
                    {service.title}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-16 transition-all duration-300" />
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 text-center mt-2 sm:mt-3 max-w-[280px] px-4 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {services.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'bg-blue-600 w-4' : 'bg-blue-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 