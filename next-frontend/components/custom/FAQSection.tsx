"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useState } from "react";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I join a membership?",
      answer: "Getting started is easy! Simply click the 'Join Now' button and follow the registration process. You'll be able to choose from our different membership tiers based on your needs."
    },
    {
      question: "What is Echo Loop?",
      answer: "Echo Loop is our innovative system that connects artists directly with their supporters, allowing for meaningful engagement and sustainable revenue sharing. It ensures artists retain ownership of their data and earnings."
    },
    {
      question: "How are my donations processed?",
      answer: "We use secure payment processors like PayPal and Stripe to handle donations. All transactions are encrypted and your financial information is never stored on our servers."
    },
    {
      question: "Can I refer friends and earn rewards?",
      answer: "Yes! Our referral program allows you to invite friends to join Bema Hub. When they sign up through your referral link, you'll both receive benefits based on their membership tier."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20">
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Bema Hub
          </p>
        </div>
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader 
                className="cursor-pointer flex flex-row items-center justify-between"
                onClick={() => toggleFAQ(index)}
              >
                <CardTitle className="text-lg font-medium">
                  {faq.question}
                </CardTitle>
                <Plus className={`h-5 w-5 text-muted-foreground transition-transform ${openIndex === index ? 'rotate-45' : ''}`} />
              </CardHeader>
              {openIndex === index && (
                <CardContent>
                  <p className="text-muted-foreground">
                    {faq.answer}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}