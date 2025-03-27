import { useLocation } from "wouter";
import { useRef, useEffect } from "react";

interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  redirectUrl: string;
}

const banners: Banner[] = [
  {
    id: "1",
    title: "Insurance Claims",
    description: "Get expert help with your insurance claims",
    imageUrl: "/images/banner1.jpg",
    buttonText: "File a Claim",
    redirectUrl: "/service/file-claim"
  },
  {
    id: "2",
    title: "Policy Analysis",
    description: "Understand your policy better",
    imageUrl: "/images/banner2.jpg",
    buttonText: "Analyze Policy",
    redirectUrl: "/service/policy-analysis"
  },
  {
    id: "3",
    title: "Expert Consultation",
    description: "Talk to our insurance experts",
    imageUrl: "/images/banner3.jpg",
    buttonText: "Consult Now",
    redirectUrl: "/service/consult"
  }
];

export default function AdCampaign() {
  const [_, setLocation] = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || hasScrolledRef.current) return;

    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    
    // Only scroll if content is wider than container
    if (scrollWidth > clientWidth) {
      // Scroll to the end
      container.scrollTo({
        left: scrollWidth - clientWidth,
        behavior: 'smooth'
      });
      
      // After scrolling back to start
      setTimeout(() => {
        container.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      }, 1000);
    }
    
    hasScrolledRef.current = true;
  }, []);

  const handleClick = (url: string) => {
    setLocation(url);
  };

  return (
    <section className="py-6 md:py-8 bg-white">
      <div className="container mx-auto px-4">
        <div 
          ref={scrollContainerRef}
          className="flex gap-3 md:gap-4 overflow-x-auto md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {banners.map((banner) => (
            <div 
              key={banner.id}
              className="relative w-[calc(100vw-2rem)] md:w-[calc(33.333%-1rem)] flex-shrink-0 h-[200px] md:h-[250px] rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300"
              onClick={() => handleClick(banner.redirectUrl)}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${banner.imageUrl})` }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 text-white">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                  <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2 drop-shadow-sm">{banner.title}</h3>
                  <p className="text-xs md:text-sm opacity-90 mb-4 md:mb-6 line-clamp-2 drop-shadow-sm">{banner.description}</p>
                  <button 
                    className="w-fit px-4 md:px-6 py-1.5 md:py-2 bg-white/90 text-blue-950 rounded-full font-medium hover:bg-white transition-all duration-200 text-sm md:text-base shadow-sm hover:shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(banner.redirectUrl);
                    }}
                  >
                    {banner.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 