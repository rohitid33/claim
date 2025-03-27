import { useState, useEffect, useRef } from 'react';

// All statements
const statements = [
  "Need professional support for your insurance disputes",
  "Frustrated by claim settlement delays",
  "Ready to challenge a rejected insurance claim",
  "Is your claim process too confusing",
  "Ready for a fair claim resolution",
  "Worried about unfair claim deductions",
  "Need guidance to speed up your claim",
  "Don't know where to start with your claim",
  "Overwhelmed by endless back-and-forth communication"
];

// Group statements into sets of 3
const groupedStatements: string[][] = [];
for (let i = 0; i < statements.length; i += 3) {
  groupedStatements.push(statements.slice(i, i + 3));
}

// Add padding to last group if needed
if (groupedStatements[groupedStatements.length - 1].length < 3) {
  const lastGroup = groupedStatements[groupedStatements.length - 1];
  while (lastGroup.length < 3) {
    // Use statements from the beginning to fill the last group
    lastGroup.push(statements[lastGroup.length - 3]);
  }
}

// Create a continuous array for infinite scrolling by repeating groups
const scrollGroups = [...groupedStatements, ...groupedStatements];

export default function ClaimBanners() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const mobileScrollContainerRef = useRef<HTMLDivElement>(null);
  const desktopScrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scrolling for mobile view (one banner at a time)
  useEffect(() => {
    if (!isMobile || !mobileScrollContainerRef.current) return;

    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % statements.length;
        
        // Scroll to the next banner
        const container = mobileScrollContainerRef.current;
        if (container) {
          const nextItem = container.children[nextIndex] as HTMLElement;
          
          if (nextItem) {
            container.scrollTo({
              left: nextItem.offsetLeft,
              behavior: 'smooth'
            });
          }
        }
        
        return nextIndex;
      });
    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(timer);
  }, [isMobile]);

  // Auto-scrolling for desktop view (groups of 3)
  useEffect(() => {
    if (isMobile || !desktopScrollContainerRef.current) return;

    const container = desktopScrollContainerRef.current;
    
    const timer = setInterval(() => {
      setActiveGroupIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % groupedStatements.length;
        
        // Calculate the scroll position (each group takes up 100% of container width)
        const scrollPosition = nextIndex * container.clientWidth;
        
        // Scroll to the next group of 3
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
        
        return nextIndex;
      });
    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(timer);
  }, [isMobile]);

  // For mobile: show one banner at a time with auto-scroll
  if (isMobile) {
    return (
      <div className="w-full bg-white py-8">
        <div className="px-4 max-w-3xl mx-auto">
          <div 
            className="relative overflow-hidden" 
            style={{ height: '120px' }}
          >
            <div 
              ref={mobileScrollContainerRef}
              className="flex snap-x snap-mandatory overflow-x-auto hide-scrollbar"
              style={{ scrollBehavior: 'smooth', scrollSnapType: 'x mandatory' }}
            >
              {statements.map((statement, index) => (
                <div
                  key={index}
                  className={`
                    flex-shrink-0 w-[calc(100%-2rem)] snap-center mx-auto
                    flex items-center
                    h-24 px-5 rounded-2xl
                    bg-blue-50
                    transition-all duration-300
                    ${activeIndex === index ? 'opacity-100' : 'opacity-50'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <svg 
                        className="w-5 h-5 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                    </div>
                    <p className="text-base md:text-lg font-medium text-gray-800 leading-snug">
                      {statement}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Indicator dots */}
            <div className="flex justify-center mt-4 gap-1">
              {statements.map((_, index) => (
                <div 
                  key={index}
                  className={`
                    w-1.5 h-1.5 rounded-full transition-all duration-300
                    ${activeIndex === index ? 'bg-blue-600' : 'bg-blue-200'}
                  `}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For desktop: show groups of 3 banners that scroll horizontally
  return (
    <div className="w-full bg-white py-10">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden">
          {/* Left and right fade effects */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          
          {/* Scrolling container for groups of 3 */}
          <div 
            ref={desktopScrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
            style={{ scrollBehavior: 'smooth' }}
          >
            {/* Each group of 3 takes exactly 100% of the container width */}
            {scrollGroups.map((group, groupIdx) => (
              <div 
                key={`group-${groupIdx}`} 
                className="flex-shrink-0 w-full flex justify-between gap-4 snap-center"
              >
                {group.map((statement, itemIdx) => (
                  <div
                    key={`group-${groupIdx}-item-${itemIdx}`}
                    className="
                      flex-1
                      flex items-center
                      h-24 px-4 rounded-2xl
                      bg-blue-50
                      transition-all duration-300
                    "
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <svg 
                          className="w-5 h-5 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 13l4 4L19 7" 
                          />
                        </svg>
                      </div>
                      <p className="text-base md:text-lg font-medium text-gray-800 leading-snug">
                        {statement}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Group indicators */}
          <div className="flex justify-center mt-6 gap-1">
            {groupedStatements.map((_, index) => (
              <div 
                key={index}
                className={`
                  w-1.5 h-1.5 rounded-full transition-all duration-300
                  ${activeGroupIndex === index ? 'bg-blue-600' : 'bg-blue-200'}
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add CSS for hiding scrollbars
const style = `
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
  }
`;

// Add style to the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = style;
  document.head.appendChild(styleElement);
}