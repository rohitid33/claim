import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Indra Goyal",
    role: "Life Insurance Claim",
    content: "ClaimSutra helped me get my life insurance claim settled within weeks.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
  },
  {
    name: "Rakesh Chauhan",
    role: "Health Insurance Dispute",
    content: "Professional team that guided me through the entire resolution process.",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
  },
  {
    name: "Ankit Kumar",
    role: "Policy Review",
    content: "Their expert analysis saved me from a potential claim rejection.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
  },
];

export default function Testimonials() {
  // Calculate total width for the container
  const cardWidth = 320; // w-80 = 20rem = 320px
  const gap = 24; // gap-6 = 1.5rem = 24px
  const totalWidth = testimonials.length * (cardWidth + gap);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          What Our Clients Say
        </h2>
        
        <div className="relative max-w-5xl mx-auto overflow-hidden scroll-container">
          {/* Testimonials container with continuous CSS animation */}
          <div 
            className="flex gap-6 animate-scroll"
            style={{ 
              willChange: 'transform',
              width: `${totalWidth * 2}px` // Double width for the duplicated set
            }}
          >
            {/* First set of testimonials */}
            {testimonials.map((testimonial, index) => (
              <Card key={`first-${index}`} className="flex-shrink-0 w-80 border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-gray-600 mb-3">{testimonial.content}</p>
                      <h3 className="font-medium text-sm text-gray-900">{testimonial.name}</h3>
                      <p className="text-xs text-primary">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Duplicate set for seamless scrolling */}
            {testimonials.map((testimonial, index) => (
              <Card key={`second-${index}`} className="flex-shrink-0 w-80 border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-gray-600 mb-3">{testimonial.content}</p>
                      <h3 className="font-medium text-sm text-gray-900">{testimonial.name}</h3>
                      <p className="text-xs text-primary">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Add gradient overlays for better visual effect */}
          <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
