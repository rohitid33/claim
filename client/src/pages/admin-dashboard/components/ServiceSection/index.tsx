import React from "react";
import { ServiceForm } from "./ServiceForm";
import { ServiceCard } from "./ServiceCard";
import { CategoryData } from "@/data/categories-data";
import { ServiceData, SubcategoryData } from "@/components/services/service-template";

interface ServiceSectionProps {
  services: ServiceData[];
  categories: CategoryData[];
  subcategories: SubcategoryData[];
  serviceId: string;
  setServiceId: (value: string) => void;
  serviceTitle: string;
  setServiceTitle: (value: string) => void;
  serviceIcon: string;
  setServiceIcon: (value: string) => void;
  serviceDescription: string;
  setServiceDescription: (value: string) => void;
  serviceFeatures: string;
  setServiceFeatures: (value: string) => void;
  servicePopular: boolean;
  setServicePopular: (value: boolean) => void;
  serviceEligibility: string;
  setServiceEligibility: (value: string) => void;
  serviceDocuments: string;
  setServiceDocuments: (value: string) => void;
  serviceFaqs: {question: string, answer: string}[];
  setServiceFaqs: (value: {question: string, answer: string}[]) => void;
  faqQuestion: string;
  setFaqQuestion: (value: string) => void;
  faqAnswer: string;
  setFaqAnswer: (value: string) => void;
  serviceProcess: {
    title: string;
    steps: string[];
  }[];
  setServiceProcess: (value: {
    title: string;
    steps: string[];
  }[]) => void;
  processTitle: string;
  setProcessTitle: (value: string) => void;
  processSteps: string;
  setProcessSteps: (value: string) => void;
  contactPhone: string;
  setContactPhone: (value: string) => void;
  contactEmail: string;
  setContactEmail: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedSubcategories: string[];
  setSelectedSubcategories: (value: string[]) => void;
  activeServiceSection: string;
  setActiveServiceSection: (value: string) => void;
  editServiceId: string | null;
  setEditServiceId: (value: string | null) => void;
  onAddService: () => void;
  onDeleteService: (id: string) => void;
  isLoading: boolean;
}

export function ServiceSection({
  services,
  categories,
  subcategories,
  serviceId,
  setServiceId,
  serviceTitle,
  setServiceTitle,
  serviceIcon,
  setServiceIcon,
  serviceDescription,
  setServiceDescription,
  serviceFeatures,
  setServiceFeatures,
  servicePopular,
  setServicePopular,
  serviceEligibility,
  setServiceEligibility,
  serviceDocuments,
  setServiceDocuments,
  serviceFaqs,
  setServiceFaqs,
  faqQuestion,
  setFaqQuestion,
  faqAnswer,
  setFaqAnswer,
  serviceProcess,
  setServiceProcess,
  processTitle,
  setProcessTitle,
  processSteps,
  setProcessSteps,
  contactPhone,
  setContactPhone,
  contactEmail,
  setContactEmail,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategories,
  setSelectedSubcategories,
  activeServiceSection,
  setActiveServiceSection,
  editServiceId,
  setEditServiceId,
  onAddService,
  onDeleteService,
  isLoading
}: ServiceSectionProps) {
  
  const handleEditService = (service: ServiceData) => {
    setServiceId(service.id);
    setServiceTitle(service.title);
    setServiceIcon(service.icon);
    setServiceDescription(service.description);
    setServiceFeatures(Array.isArray(service.features) ? service.features.join(', ') : "");
    setServicePopular(service.popular || false);
    setSelectedCategory(service.category || "");
    setSelectedSubcategories(service.subcategoryIds || []);
    setServiceEligibility(Array.isArray(service.eligibility) ? service.eligibility.join(', ') : "");
    setServiceDocuments(Array.isArray(service.documents) ? service.documents.join(', ') : "");
    
    // Update process handling
    if (service.process && service.process.length > 0) {
      const firstProcess = service.process[0];
      setProcessTitle(firstProcess.title || "");
      setProcessSteps(Array.isArray(firstProcess.steps) ? firstProcess.steps.join(', ') : "");
    }
    
    setServiceFaqs(service.faqs || []);
    setContactPhone(service.contactInfo?.phone || "");
    setContactEmail(service.contactInfo?.email || "");
    setEditServiceId(service.id);
    setActiveServiceSection("basic");
  };

  const handleCancelEdit = () => {
    setEditServiceId(null);
    setServiceId("");
    setServiceTitle("");
    setServiceIcon("");
    setServiceDescription("");
    setServiceFeatures("");
    setServicePopular(false);
    setServiceEligibility("");
    setServiceDocuments("");
    setServiceProcess([]);
    setServiceFaqs([]);
    setContactPhone("");
    setContactEmail("");
    setSelectedCategory("");
    setSelectedSubcategories([]);
    setActiveServiceSection("basic");
  };

  const handleAddFaq = () => {
    if (faqQuestion && faqAnswer) {
      setServiceFaqs([...serviceFaqs, { question: faqQuestion, answer: faqAnswer }]);
      setFaqQuestion("");
      setFaqAnswer("");
    }
  };

  const handleRemoveFaq = (index: number) => {
    setServiceFaqs(serviceFaqs.filter((_, i) => i !== index));
  };

  const handleAddProcess = () => {
    if (processTitle && processSteps) {
      const stepsArray = processSteps.split(',').map(step => step.trim()).filter(Boolean);
      const newProcess = {
        title: processTitle,
        steps: stepsArray
      };
      setServiceProcess([...serviceProcess, newProcess]);
      setProcessTitle("");
      setProcessSteps("");
    }
  };

  const handleRemoveProcess = (index: number) => {
    setServiceProcess(serviceProcess.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="mb-8">
        <ServiceForm
          serviceId={serviceId}
          setServiceId={setServiceId}
          serviceTitle={serviceTitle}
          setServiceTitle={setServiceTitle}
          serviceIcon={serviceIcon}
          setServiceIcon={setServiceIcon}
          serviceDescription={serviceDescription}
          setServiceDescription={setServiceDescription}
          serviceFeatures={serviceFeatures}
          setServiceFeatures={setServiceFeatures}
          servicePopular={servicePopular}
          setServicePopular={setServicePopular}
          serviceEligibility={serviceEligibility}
          setServiceEligibility={setServiceEligibility}
          serviceDocuments={serviceDocuments}
          setServiceDocuments={setServiceDocuments}
          serviceFaqs={serviceFaqs}
          setServiceFaqs={setServiceFaqs}
          faqQuestion={faqQuestion}
          setFaqQuestion={setFaqQuestion}
          faqAnswer={faqAnswer}
          setFaqAnswer={setFaqAnswer}
          serviceProcess={serviceProcess}
          setServiceProcess={setServiceProcess}
          processTitle={processTitle}
          setProcessTitle={setProcessTitle}
          processSteps={processSteps}
          setProcessSteps={setProcessSteps}
          contactPhone={contactPhone}
          setContactPhone={setContactPhone}
          contactEmail={contactEmail}
          setContactEmail={setContactEmail}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubcategories={selectedSubcategories}
          setSelectedSubcategories={setSelectedSubcategories}
          categories={categories}
          subcategories={subcategories}
          activeSection={activeServiceSection}
          setActiveSection={setActiveServiceSection}
          editServiceId={editServiceId}
          onAddService={onAddService}
          onCancelEdit={handleCancelEdit}
          onAddFaq={handleAddFaq}
          onRemoveFaq={handleRemoveFaq}
          onAddProcess={handleAddProcess}
          onRemoveProcess={handleRemoveProcess}
          isLoading={isLoading}
        />
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Existing Services</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.length > 0 ? (
          services.map((service) => (
            <ServiceCard 
              key={service.id}
              service={service}
              categories={categories}
              subcategories={subcategories}
              onEdit={handleEditService}
              onDelete={onDeleteService}
            />
          ))
        ) : (
          <div className="col-span-3 text-center p-8">
            <p className="text-muted-foreground">No services found. Add a new service to get started.</p>
          </div>
        )}
      </div>
    </>
  );
}