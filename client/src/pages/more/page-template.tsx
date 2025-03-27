import React from "react";
import { Button } from "@/components/ui/button";

export default function PageTemplate({ title }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          This is a template page for {title}. Replace this content with actual content for the specific page.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Section Title</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, 
          nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt,
          nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Another Section</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, 
          nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt,
          nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Card Title</h3>
            <p>Card description goes here. This is a sample card for the template page.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Card Title</h3>
            <p>Card description goes here. This is a sample card for the template page.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Card Title</h3>
            <p>Card description goes here. This is a sample card for the template page.</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Section</h2>
        <p>
          If you have any questions or would like to learn more, please don't hesitate to get in touch.
        </p>
        
        <div className="bg-primary/10 p-6 rounded-lg mt-6">
          <p className="font-medium">Claimsutra</p>
          <p>F-97, Newry Shreya Apartments Anna Nagar East,</p>
          <p>Chennai, Tamil Nadu 600102, India</p>
          <p className="mt-4">Phone: +91-8630959445</p>
          <p>Email: info@claimsutra.com</p>
        </div>
        
        <div className="mt-8">
          <Button>Call to Action</Button>
        </div>
      </div>
    </div>
  );
}