"use client";

import { Pill } from "./pill";

const steps = [
  {
    number: "01",
    title: "Generate Journey",
    description: "POST one API call with your goal and audience. AI creates a complete email sequence.",
    endpoint: "POST /journeys",
    code: `{
  "goal": "Convert trial to paid",
  "audience": "B2B SaaS trials"
}`,
  },
  {
    number: "02",
    title: "Enroll Contacts",
    description: "Enroll users into your journey. Our scheduler handles timing and delivery.",
    endpoint: "POST /enrollments",
    code: `{
  "journey_id": "jrn_123",
  "contact": {
    "email": "user@example.com"
  }
}`,
  },
  {
    number: "03",
    title: "Stop on Convert",
    description: "Fire a conversion event when users upgrade. Future sends stop within 60 seconds.",
    endpoint: "POST /events",
    code: `{
  "type": "conversion",
  "contact_email": "user@example.com",
  "journey_id": "jrn_123"
}`,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 bg-[#0a0a0a]/30">
      <div className="container">
        <div className="text-center mb-16 md:mb-20">
          <Pill className="mb-6">HOW IT WORKS</Pill>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-sentient">
            Three API calls. <br className="sm:hidden" />
            <i className="font-light">That's it.</i>
          </h2>
          <p className="font-mono text-sm sm:text-base text-foreground/60 mt-6 max-w-[600px] mx-auto">
            No complex workflows. No visual builders. Just clean, predictable APIs.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="grid md:grid-cols-2 gap-8 items-start"
            >
              <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="font-mono text-primary text-sm">{step.number}</span>
                  <h3 className="font-sentient text-3xl md:text-4xl">
                    {step.title}
                  </h3>
                </div>
                <p className="font-mono text-sm text-foreground/60 mb-4 leading-relaxed">
                  {step.description}
                </p>
                <div className="inline-block font-mono text-xs text-primary/80 bg-primary/10 px-3 py-2 border border-primary/20">
                  {step.endpoint}
                </div>
              </div>
              
              <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className="bg-[#0a0a0a] border border-border p-6 font-mono text-sm">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <pre className="text-foreground/80 overflow-x-auto">
                    <code>{step.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

