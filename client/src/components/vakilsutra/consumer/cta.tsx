import { Button } from "@/components/ui/button";

export default function ConsumerCTA() {
  const scrollToServices = () => {
    const serviceSection = document.getElementById('service-section');
    if (serviceSection) {
      serviceSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="bg-blue-600 text-white rounded-2xl">
      <div className="container mx-auto py-4 text-center px-4">
        <h2 className="text-xl font-bold sm:text-2xl">
          Ready to Fight for Your Consumer Rights?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm opacity-90">
          Our expert legal team is here to help you resolve your consumer complaints.
          Get started today with a free consultation.
        </p>
        <Button size="default" variant="secondary" className="mt-3" onClick={scrollToServices}>
          File Your Complaint Now
        </Button>
      </div>
    </section>
  );
} 