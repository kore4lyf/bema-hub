"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useState } from "react";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is BemaHub?",
      answer: "BemaHub is a community platform that helps faith-driven artists connect with listeners who truly appreciate their message. We focus on building genuine relationships rather than chasing algorithms."
    },
    {
      question: "How does BemaHub work?",
      answer: "Artists share their music and stories with our community. Listeners discover new artists, support their work, and help them grow. It's about real people supporting real artists, not faceless algorithms."
    },
    {
      question: "What makes BemaHub different?",
      answer: "We're not trying to be the biggest music platform. We're focused on creating meaningful connections between faith-driven artists and people who share their values. Quality over quantity."
    },
    {
      question: "How can I support artists on BemaHub?",
      answer: "You can support artists by listening to their music, sharing their content, participating in their campaigns, and connecting with them directly. Every interaction helps them reach more people who will appreciate their work."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20">
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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