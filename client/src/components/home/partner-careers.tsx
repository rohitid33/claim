import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Building2, Briefcase } from "lucide-react";

export default function PartnerAndCareers() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Partner Section */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold">Become Our Partner</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Join our network of insurance professionals and help customers resolve their insurance grievances.
              We provide the platform, you provide the expertise.
            </p>
            <Button asChild>
              <Link href="/partner">Partner With Us</Link>
            </Button>
          </div>

          {/* Careers Section */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Briefcase className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold">Careers</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Looking for a challenging career in insurtech? Join our team and help
              transform the insurance claims experience for millions.
            </p>
            <Button asChild>
              <Link href="/careers">View Openings</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
