import { Card, CardContent } from "@/components/ui/card";

const aboutUsBanners = [
  {
    icon: "🏢",
    title: "Who We Are",
    description: "Leading insurance claim resolution platform in India",
  },
  {
    icon: "🎯",
    title: "Our Mission",
    description: "Simplifying insurance claims for every Indian",
  },
  {
    icon: "💫",
    title: "Our Vision",
    description: "To be India's most trusted insurance partner",
  },
  {
    icon: "🤝",
    title: "Our Values",
    description: "Trust, Transparency, and Customer First",
  },
  {
    icon: "📈",
    title: "Our Impact",
    description: "10,000+ successful claim resolutions",
  },
  {
    icon: "🌟",
    title: "Why Choose Us",
    description: "Expert team with decades of experience",
  },
];

export default function AboutUs() {
  return (
    <section id="about-us" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-6 pb-4 min-w-max">
            {aboutUsBanners.map((banner, index) => (
              <Card key={index} className="min-w-[280px]">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{banner.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{banner.title}</h3>
                  <p className="text-muted-foreground">{banner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
