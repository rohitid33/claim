import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Product Liability Case",
    content: "Vakilsutra helped me win my case against a defective product manufacturer. Their expertise in consumer law was invaluable.",
    image: "/images/consumer/testimonial-1.jpg",
  },
  {
    name: "Rajesh Kumar",
    role: "Service Dispute",
    content: "Professional team that guided me through the entire consumer court process. Got my refund within weeks.",
    image: "/images/consumer/testimonial-2.jpg",
  },
  {
    name: "Anita Patel",
    role: "Consumer Rights",
    content: "Their expert legal advice saved me from falling victim to unfair trade practices. Highly recommended!",
    image: "/images/consumer/testimonial-3.jpg",
  },
];

export default function ConsumerTestimonials() {
  const cardWidth = 320;
  const gap = 24;
  const totalWidth = testimonials.length * (cardWidth + gap);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Success Stories from Our Clients
        </h2>
        
        <div className="relative max-w-5xl mx-auto overflow-hidden scroll-container">
          <div 
            className="flex gap-6 animate-scroll"
            style={{ 
              willChange: 'transform',
              width: `${totalWidth * 2}px`
            }}
          >
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
                      <p className="text-xs text-blue-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
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
                      <p className="text-xs text-blue-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
} 