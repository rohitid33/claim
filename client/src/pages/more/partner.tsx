import React from "react";
import { Button } from "@/components/ui/button";

const partnerTypes = [
  {
    title: "Insurance Brokers & Agents",
    description: "Enhance your service offerings by providing expert claim assistance to your clients. Our partnership allows you to focus on selling policies while we handle the claims.",
    benefits: [
      "Additional revenue stream through referral commissions",
      "Increased client satisfaction and retention",
      "Access to our claim expertise and resources",
      "Regular updates on claim trends and insights",
      "Co-branded marketing materials"
    ],
    icon: "🤝"
  },
  {
    title: "Legal Professionals",
    description: "Partner with us to provide comprehensive claim support to your clients dealing with insurance matters, allowing you to focus on core legal services.",
    benefits: [
      "Complementary service offering for your clients",
      "Referral fees for successful partnerships",
      "Access to insurance expertise and resources",
      "Reduced administrative burden for insurance matters",
      "Joint marketing opportunities"
    ],
    icon: "⚖️"
  },
  {
    title: "Financial Advisors",
    description: "Expand your advisory services by offering professional claim assistance to clients with insurance products in their financial portfolio.",
    benefits: [
      "Holistic financial service offering",
      "Additional revenue through partnership",
      "Enhanced client relationship management",
      "Regular industry insights and updates",
      "Co-branded educational materials"
    ],
    icon: "💼"
  },
  {
    title: "Corporate Partnerships",
    description: "Offer Claimsutra's services as an employee benefit or as part of your customer loyalty program to enhance your value proposition.",
    benefits: [
      "Unique employee/customer benefit",
      "Customized service packages",
      "Dedicated account manager",
      "Regular performance reporting",
      "White-labeled solutions available"
    ],
    icon: "🏢"
  }
];

const testimonials = [
  {
    quote: "Partnering with Claimsutra has been a game-changer for our insurance brokerage. Our clients are thrilled with the claim support, and we've seen a significant increase in retention rates.",
    name: "Vikram Mehta",
    title: "Director, Secure Insurance Brokers",
    company: "Secure Insurance Brokers",
    image: "https://randomuser.me/api/portraits/men/42.jpg"
  },
  {
    quote: "As a law firm specializing in consumer rights, our partnership with Claimsutra has allowed us to provide comprehensive support to clients with insurance disputes. It's been a fruitful collaboration.",
    name: "Priya Sharma",
    title: "Senior Partner",
    company: "Sharma & Associates",
    image: "https://randomuser.me/api/portraits/women/28.jpg"
  },
  {
    quote: "We integrated Claimsutra's services into our employee benefits package, and the feedback has been overwhelmingly positive. It's a unique benefit that truly adds value to our employees' lives.",
    name: "Rajesh Kumar",
    title: "HR Director",
    company: "TechSolutions India",
    image: "https://randomuser.me/api/portraits/men/64.jpg"
  }
];

export default function PartnerPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Partner With Us</h1>
      
      {/* Hero Section */}
      <div className="bg-primary/10 rounded-lg overflow-hidden mb-12">
        <div className="md:flex">
          <div className="md:w-3/5 p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Grow Your Business With Claimsutra</h2>
            <p className="text-lg mb-6">
              Join forces with India's leading insurance claim expert to enhance your service offerings, 
              increase client satisfaction, and create new revenue streams. Our partnership programs are 
              designed to be mutually beneficial and tailored to your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="px-8">Become a Partner</Button>
              <Button size="lg" variant="outline" className="px-8">Schedule a Call</Button>
            </div>
          </div>
          <div className="md:w-2/5 bg-primary/20 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-xl">Active Partners Nationwide</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Partnership Types */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Partnership Opportunities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {partnerTypes.map((type, index) => (
            <div key={index} className="bg-card p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-4">{type.icon}</span>
                <h3 className="text-xl font-semibold">{type.title}</h3>
              </div>
              <p className="mb-4">{type.description}</p>
              
              <h4 className="font-medium mb-2">Key Benefits:</h4>
              <ul className="space-y-1 mb-6">
                {type.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button variant="outline" className="w-full">Learn More</Button>
            </div>
          ))}
        </div>
      </section>
      
      {/* How It Works */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">How Our Partnership Works</h2>
        
        <div className="bg-card rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8">
              <div className="space-y-6">
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Initial Consultation</h3>
                    <p>We'll discuss your business needs and how our partnership can add value to your clients or employees.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">2</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Customized Partnership Plan</h3>
                    <p>We'll create a tailored partnership agreement that aligns with your business goals and client needs.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">3</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Integration & Training</h3>
                    <p>We'll provide all necessary training and resources to seamlessly integrate our services into your offerings.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">4</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Ongoing Support & Growth</h3>
                    <p>Our dedicated partnership team will provide continuous support and explore new opportunities for growth.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 bg-primary/10 p-8 flex items-center justify-center">
              <div className="max-w-md">
                <h3 className="text-xl font-semibold mb-4">Partner Benefits at a Glance</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 font-bold">✓</span>
                    <span>Competitive commission structure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 font-bold">✓</span>
                    <span>Dedicated partnership manager</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 font-bold">✓</span>
                    <span>Marketing and promotional support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 font-bold">✓</span>
                    <span>Regular performance reviews and optimization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 font-bold">✓</span>
                    <span>Access to exclusive partner events and resources</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 font-bold">✓</span>
                    <span>Co-branding opportunities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Partner Success Stories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <svg className="h-8 w-8 text-primary/60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="mb-6 italic">{testimonial.quote}</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">What are the requirements to become a partner?</h3>
            <p>We look for partners who share our commitment to customer service and have an established business in relevant industries. There are no specific size requirements, as we work with businesses of all scales.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">How is the commission structure determined?</h3>
            <p>Commission rates vary based on partnership type, volume of referrals, and the specific services utilized. We'll discuss the details during our initial consultation to ensure a fair and mutually beneficial arrangement.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Can we white-label Claimsutra's services?</h3>
            <p>Yes, we offer white-labeling options for certain partnership types, allowing you to provide our services under your brand. This is typically available for corporate partnerships and larger broker arrangements.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">How long does it take to set up a partnership?</h3>
            <p>The timeline varies depending on the complexity of the partnership, but typically ranges from 2-4 weeks from initial consultation to full implementation.</p>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-primary/10 p-8 rounded-lg">
        <div className="md:flex items-center justify-between">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-semibold mb-2">Ready to Explore a Partnership?</h2>
            <p>Schedule a no-obligation consultation with our partnership team to discuss how we can work together.</p>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <Button size="lg" className="px-8">Contact Us Today</Button>
          </div>
        </div>
      </section>
    </div>
  );
}