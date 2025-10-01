"use client";

import { Pill } from "./pill";

const benefits = [
  {
    metric: "10 min",
    label: "Integration Time",
    description: "From API key to first send",
  },
  {
    metric: "5-7",
    label: "Emails per Journey",
    description: "AI-generated with perfect spacing",
  },
  {
    metric: "<60s",
    label: "Stop Latency",
    description: "Conversion event to send halt",
  },
  {
    metric: "100%",
    label: "Developer-Owned",
    description: "No marketing tools to learn",
  },
];

const valueProps = [
  {
    title: "Skip the copywriting",
    description: "AI writes compelling, on-brand emails for your entire nurture sequence. No more blank page anxiety.",
  },
  {
    title: "No email infrastructure",
    description: "Bring your Resend key. We handle scheduling, idempotency, retries, and compliance.",
  },
  {
    title: "Built for PLG",
    description: "Stop-on-convert is core, not an afterthought. Perfect for trial-to-paid conversion flows.",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="relative py-24 md:py-32 container">
      <div className="text-center mb-16 md:mb-20">
        <Pill className="mb-6">VALUE</Pill>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-sentient">
          Ship lifecycle emails <br className="hidden sm:inline" />
          <i className="font-light">today</i>, not next quarter
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 max-w-6xl mx-auto mb-20">
        {benefits.map((benefit, index) => (
          <div key={index} className="text-center">
            <div className="font-sentient text-5xl md:text-6xl text-primary mb-3">
              {benefit.metric}
            </div>
            <div className="font-mono text-sm uppercase text-foreground/80 mb-2 tracking-wide">
              {benefit.label}
            </div>
            <div className="font-mono text-xs text-foreground/50">
              {benefit.description}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
        {valueProps.map((prop, index) => (
          <div key={index} className="text-center">
            <h3 className="font-sentient text-2xl mb-4 text-foreground">
              {prop.title}
            </h3>
            <p className="font-mono text-sm text-foreground/60 leading-relaxed">
              {prop.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

