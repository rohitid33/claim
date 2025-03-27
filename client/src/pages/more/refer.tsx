import React from "react";
import { Button } from "@/components/ui/button";

const rewards = [
  {
    level: "Bronze",
    referrals: "1-3 referrals",
    rewards: [
      "₹500 per successful referral",
      "Exclusive access to claim tips newsletter",
      "Digital referral badge"
    ],
    color: "bg-amber-700/10 border-amber-700/30"
  },
  {
    level: "Silver",
    referrals: "4-7 referrals",
    rewards: [
      "₹750 per successful referral",
      "All Bronze rewards",
      "Free policy review session",
      "Priority customer support"
    ],
    color: "bg-gray-300/20 border-gray-400/40"
  },
  {
    level: "Gold",
    referrals: "8-12 referrals",
    rewards: [
      "₹1,000 per successful referral",
      "All Silver rewards",
      "Complimentary legal consultation (30 min)",
      "Exclusive webinar access"
    ],
    color: "bg-yellow-400/10 border-yellow-500/30"
  },
  {
    level: "Platinum",
    referrals: "13+ referrals",
    rewards: [
      "₹1,500 per successful referral",
      "All Gold rewards",
      "VIP claim assistance",
      "Annual dinner with Claimsutra leadership",
      "Featured in our 'Top Referrers' showcase"
    ],
    color: "bg-blue-500/10 border-blue-500/30"
  }
];

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    quote: "I've referred 5 friends to Claimsutra and earned over ₹3,000 in rewards. The process was incredibly simple, and my friends were all happy with the service they received.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    earned: "₹3,750"
  },
  {
    name: "Rahul Verma",
    location: "Delhi",
    quote: "The refer and earn program is fantastic! Not only did I help my colleagues get the claim assistance they needed, but I also earned enough to treat myself to a nice weekend getaway.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    earned: "₹9,000"
  },
  {
    name: "Ananya Patel",
    location: "Bangalore",
    quote: "As someone who works in HR, I've referred many colleagues who had insurance claim issues. The process is seamless, and the rewards are generous. It's a win-win!",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    earned: "₹15,000"
  }
];

const steps = [
  {
    number: 1,
    title: "Sign Up",
    description: "Create an account or log in to your existing Claimsutra account to get your unique referral code."
  },
  {
    number: 2,
    title: "Share Your Code",
    description: "Share your referral code with friends, family, and colleagues who might need insurance claim assistance."
  },
  {
    number: 3,
    title: "Track Referrals",
    description: "Monitor your referrals and rewards in your personalized dashboard."
  },
  {
    number: 4,
    title: "Earn Rewards",
    description: "Receive rewards when your referrals sign up and use Claimsutra services."
  }
];

export default function ReferAndEarnPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Refer & Earn</h1>
      
      {/* Hero Section */}
      <div className="bg-primary/10 rounded-lg overflow-hidden mb-12">
        <div className="md:flex">
          <div className="md:w-3/5 p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Refer Friends & Earn Rewards</h2>
            <p className="text-lg mb-6">
              Know someone struggling with an insurance claim? Refer them to Claimsutra and earn rewards for every successful referral. It's our way of saying thank you for spreading the word.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="px-8">Get Your Referral Code</Button>
              <Button size="lg" variant="outline" className="px-8">Learn More</Button>
            </div>
          </div>
          <div className="md:w-2/5 bg-primary/20 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">₹20,000+</div>
              <p className="text-xl">Earned by our top referrers</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="bg-card p-6 rounded-lg shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Rewards Tiers */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Reward Tiers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rewards.map((tier) => (
            <div 
              key={tier.level} 
              className={`border-2 rounded-lg overflow-hidden ${tier.color}`}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{tier.level}</h3>
                <p className="text-sm mb-4">{tier.referrals}</p>
                
                <h4 className="font-medium mb-2">Rewards:</h4>
                <ul className="space-y-2">
                  {tier.rewards.map((reward, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>{reward}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Success Stories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
              <p className="mb-4 italic">"{testimonial.quote}"</p>
              <div className="bg-primary/10 p-3 rounded-md text-center">
                <p className="text-sm">Total Earned</p>
                <p className="text-xl font-bold text-primary">{testimonial.earned}</p>
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
            <h3 className="text-lg font-semibold mb-2">How do I get my referral code?</h3>
            <p>You can get your unique referral code by logging into your Claimsutra account and navigating to the "Refer & Earn" section in your dashboard.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">When do I receive my rewards?</h3>
            <p>Rewards are credited to your account within 30 days after your referral completes their first claim process with Claimsutra.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">How can I redeem my rewards?</h3>
            <p>You can choose to receive your rewards as bank transfers, gift cards, or credits for Claimsutra services. Redemption options are available in your dashboard.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Is there a limit to how many people I can refer?</h3>
            <p>No, there is no limit to the number of people you can refer. The more you refer, the more you earn!</p>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-primary/10 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Start Earning?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Get your unique referral code today and start earning rewards while helping your friends and family get the claim assistance they deserve.
        </p>
        <Button size="lg" className="px-8">Get Your Referral Code</Button>
      </section>
    </div>
  );
}