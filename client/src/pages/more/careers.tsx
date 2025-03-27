import React from "react";
import { Button } from "@/components/ui/button";

const jobOpenings = [
  {
    id: 1,
    title: "Senior Insurance Claims Specialist",
    department: "Claims Processing",
    location: "Chennai, Tamil Nadu",
    type: "Full-time",
    experience: "5+ years",
    description: "We're looking for an experienced insurance claims specialist to handle complex claims and provide expert guidance to our clients.",
    responsibilities: [
      "Review and process complex insurance claims across multiple categories",
      "Provide expert advice to clients on claim documentation and procedures",
      "Liaise with insurance companies to expedite claim settlements",
      "Identify potential issues in claim applications and suggest solutions",
      "Maintain detailed records of all claim activities and communications"
    ],
    requirements: [
      "5+ years of experience in insurance claims processing",
      "In-depth knowledge of insurance policies and claim procedures",
      "Excellent communication and negotiation skills",
      "Strong attention to detail and problem-solving abilities",
      "Familiarity with insurance regulations and compliance requirements"
    ]
  },
  {
    id: 2,
    title: "Legal Advisor - Insurance Claims",
    department: "Legal",
    location: "Mumbai, Maharashtra",
    type: "Full-time",
    experience: "3+ years",
    description: "Join our legal team to provide expert legal advice on insurance claim disputes and represent clients in challenging cases.",
    responsibilities: [
      "Provide legal advice on complex insurance claim disputes",
      "Review claim denials and develop appeal strategies",
      "Represent clients in negotiations with insurance companies",
      "Draft legal documents and correspondence related to claims",
      "Stay updated on insurance laws and regulations"
    ],
    requirements: [
      "Law degree with 3+ years of experience in insurance law",
      "Knowledge of insurance regulations and consumer protection laws",
      "Experience in dispute resolution and negotiation",
      "Strong analytical and research skills",
      "Excellent written and verbal communication abilities"
    ]
  },
  {
    id: 3,
    title: "Full Stack Developer",
    department: "Technology",
    location: "Bangalore, Karnataka",
    type: "Full-time",
    experience: "2+ years",
    description: "Help us build and enhance our digital platform that streamlines the insurance claim process for thousands of users.",
    responsibilities: [
      "Develop and maintain our web and mobile applications",
      "Implement new features and functionality based on user feedback",
      "Optimize application performance and responsiveness",
      "Collaborate with design and product teams to create intuitive user interfaces",
      "Ensure code quality through testing and code reviews"
    ],
    requirements: [
      "2+ years of experience in full stack development",
      "Proficiency in React, Node.js, and related technologies",
      "Experience with database design and management",
      "Understanding of UI/UX principles",
      "Knowledge of software development best practices"
    ]
  },
  {
    id: 4,
    title: "Customer Success Manager",
    department: "Customer Support",
    location: "Delhi, NCR",
    type: "Full-time",
    experience: "3+ years",
    description: "Lead our customer success team to ensure clients receive exceptional support throughout their claim journey.",
    responsibilities: [
      "Manage a team of customer support representatives",
      "Develop and implement customer success strategies",
      "Monitor customer satisfaction metrics and implement improvements",
      "Handle escalated customer issues and ensure timely resolution",
      "Collaborate with other departments to enhance the customer experience"
    ],
    requirements: [
      "3+ years of experience in customer success or support management",
      "Strong leadership and team management skills",
      "Excellent problem-solving and conflict resolution abilities",
      "Customer-centric mindset with a focus on satisfaction",
      "Experience in the insurance or legal services industry preferred"
    ]
  }
];

const benefits = [
  {
    title: "Competitive Compensation",
    description: "We offer competitive salaries and performance-based bonuses to reward your hard work and dedication.",
    icon: "💰"
  },
  {
    title: "Health Insurance",
    description: "Comprehensive health insurance coverage for you and your family, including dental and vision benefits.",
    icon: "🏥"
  },
  {
    title: "Professional Development",
    description: "Continuous learning opportunities, including workshops, courses, and certification programs.",
    icon: "📚"
  },
  {
    title: "Work-Life Balance",
    description: "Flexible working hours, remote work options, and generous paid time off to help you maintain a healthy balance.",
    icon: "⚖️"
  },
  {
    title: "Career Growth",
    description: "Clear career paths and regular performance reviews to help you grow professionally within the company.",
    icon: "📈"
  },
  {
    title: "Team Events",
    description: "Regular team-building activities, celebrations, and social events to foster a positive work environment.",
    icon: "🎉"
  }
];

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Careers at Claimsutra</h1>
      
      <div className="bg-primary/10 p-8 rounded-lg mb-12">
        <div className="md:flex items-center">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-semibold mb-4">Join Our Team</h2>
            <p className="mb-4">
              At Claimsutra, we're on a mission to make insurance claims simple and fair for everyone. 
              We're looking for passionate individuals who want to make a difference in people's lives 
              during challenging times.
            </p>
            <p>
              If you're driven, customer-focused, and want to be part of a growing team that values 
              innovation and integrity, we'd love to hear from you.
            </p>
          </div>
          <div className="md:w-1/3 md:pl-8 flex justify-center">
            <Button size="lg" className="px-8">View All Openings</Button>
          </div>
        </div>
      </div>
      
      {/* Current Openings */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Current Openings</h2>
        
        <div className="space-y-6">
          {jobOpenings.map((job) => (
            <div key={job.id} className="bg-card rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                    <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">
                      {job.department}
                    </span>
                    <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">
                      {job.location}
                    </span>
                    <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">
                      {job.type}
                    </span>
                  </div>
                </div>
                
                <p className="mb-4">{job.description}</p>
                
                <div className="md:flex gap-8">
                  <div className="md:w-1/2 mb-4 md:mb-0">
                    <h4 className="font-medium mb-2">Responsibilities:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {job.responsibilities.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="md:w-1/2">
                    <h4 className="font-medium mb-2">Requirements:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {job.requirements.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button>Apply Now</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Benefits */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Benefits & Perks</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-card p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Application Process */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Our Application Process</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-4">1</div>
            <h3 className="text-lg font-semibold mb-2">Application</h3>
            <p>Submit your resume and cover letter through our online portal.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-4">2</div>
            <h3 className="text-lg font-semibold mb-2">Initial Screening</h3>
            <p>Our HR team will review your application and conduct an initial phone interview.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-4">3</div>
            <h3 className="text-lg font-semibold mb-2">Technical Assessment</h3>
            <p>Complete a skills assessment or case study relevant to the position.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-4">4</div>
            <h3 className="text-lg font-semibold mb-2">Final Interview</h3>
            <p>Meet with the team and discuss your experience, skills, and fit for the role.</p>
          </div>
        </div>
      </section>
      
      {/* Contact */}
      <section className="bg-primary/10 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Don't See a Suitable Position?</h2>
        <p className="mb-6">
          We're always looking for talented individuals to join our team. If you don't see a position that matches your skills, 
          send us your resume and tell us how you can contribute to Claimsutra.
        </p>
        <Button>Send Speculative Application</Button>
      </section>
    </div>
  );
}