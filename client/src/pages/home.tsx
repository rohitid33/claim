import React from "react";
import Hero from "@/components/home/hero";
import KnowYourPolicy from "@/components/home/know-your-policy";
import Process from "@/components/home/process";
import Testimonials from "@/components/home/testimonials";
import ClaimBanners from "@/components/home/claim-banners";
import PartnerCareers from "@/components/home/partner-careers";
import CTA from "@/components/home/cta";
import SelectCategory from "@/components/home/select-category";
import AdCampaign from "@/components/home/ad-campaign";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Hero />
      <ClaimBanners />

      {/* Services Section with enhanced styling */}
      <div id="categories-section" className="relative py-16 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
              Select your category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of insurance services tailored to your needs
            </p>
          </div>
          <SelectCategory />
        </div>
      </div>

      <KnowYourPolicy />
      
      <AdCampaign />

      {/* Process Section with enhanced styling */}
      <div className="relative py-16 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="container mx-auto px-4 relative">
          <Process />
        </div>
      </div>

      <Testimonials />

      {/* Partner Careers Section with enhanced styling */}
      <div className="relative py-16 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="container mx-auto px-4 relative">
          <PartnerCareers />
        </div>
      </div>

      <CTA />
    </div>
  );
}