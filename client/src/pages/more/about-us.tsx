import React from "react";

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          Claimsutra is India's leading legal claim expert, dedicated to helping individuals and businesses navigate the complex world of insurance claims and legal disputes.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p>
          Our mission is to empower people with the knowledge and support they need to successfully resolve insurance claims and legal matters. We believe everyone deserves fair treatment and proper compensation when dealing with insurance companies and legal systems.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Vision</h2>
        <p>
          We envision a world where the process of filing and resolving insurance claims is transparent, fair, and accessible to all. We strive to be the bridge that connects people with the expertise they need to navigate complex legal and insurance landscapes.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
        <p>
          Our team consists of experienced professionals from various fields including law, insurance, customer service, and technology. This diverse expertise allows us to provide comprehensive support for all types of claims and legal matters.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Legal Experts</h3>
            <p>Our legal team has decades of combined experience in insurance law and consumer protection.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Insurance Specialists</h3>
            <p>Our insurance specialists understand the intricacies of policies and know how to maximize your claims.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Customer Support</h3>
            <p>Our dedicated support team is available to guide you through every step of the process.</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Approach</h2>
        <p>
          We take a client-centered approach to every case, ensuring that your specific needs and circumstances are taken into account. Our process is designed to be:
        </p>
        
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li><strong>Transparent:</strong> We keep you informed at every stage of the process.</li>
          <li><strong>Efficient:</strong> We work diligently to resolve your claims as quickly as possible.</li>
          <li><strong>Thorough:</strong> We leave no stone unturned in pursuing the best outcome for your case.</li>
          <li><strong>Supportive:</strong> We provide emotional and practical support throughout your journey.</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>
          If you have any questions or would like to learn more about how we can help you, please don't hesitate to get in touch. We're here to help you navigate your legal and insurance challenges.
        </p>
        
        <div className="bg-primary/10 p-6 rounded-lg mt-6">
          <p className="font-medium">Claimsutra</p>
          <p>F-97, Newry Shreya Apartments Anna Nagar East,</p>
          <p>Chennai, Tamil Nadu 600102, India</p>
          <p className="mt-4">Phone: +91-8630959445</p>
          <p>Email: info@claimsutra.com</p>
        </div>
      </div>
    </div>
  );
}