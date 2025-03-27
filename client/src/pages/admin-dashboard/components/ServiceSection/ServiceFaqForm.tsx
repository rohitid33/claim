import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceFaqFormProps {
  faqs: {question: string, answer: string}[];
  faqQuestion: string;
  setFaqQuestion: (value: string) => void;
  faqAnswer: string;
  setFaqAnswer: (value: string) => void;
  onAddFaq: () => void;
  onRemoveFaq: (index: number) => void;
}

export function ServiceFaqForm({
  faqs,
  faqQuestion,
  setFaqQuestion,
  faqAnswer,
  setFaqAnswer,
  onAddFaq,
  onRemoveFaq
}: ServiceFaqFormProps) {
  return (
    <div className="grid gap-4">
      <div>
        <Label htmlFor="faqQuestion">Question</Label>
        <Input 
          id="faqQuestion"
          value={faqQuestion}
          onChange={(e) => setFaqQuestion(e.target.value)}
          placeholder="e.g., How long does the process take?"
        />
      </div>
      
      <div>
        <Label htmlFor="faqAnswer">Answer</Label>
        <Textarea 
          id="faqAnswer"
          value={faqAnswer}
          onChange={(e) => setFaqAnswer(e.target.value)}
          placeholder="Provide a detailed answer..."
          rows={3}
        />
      </div>
      
      <Button onClick={onAddFaq} variant="outline">
        Add FAQ
      </Button>
      
      {faqs.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">FAQs</h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{faq.question}</h4>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => onRemoveFaq(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-sm">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}