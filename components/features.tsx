"use client";

import { Pill } from "./pill";
import { Sparkles, Clock, Key, Zap, Target, Rocket } from "lucide-react";

const features = [
  {
    title: "AI-Generated Campaigns",
    description: "One API call creates a complete 5-7 email journey with subjects, bodies, and timing.",
    icon: Sparkles,
  },
  {
    title: "Smart Scheduling",
    description: "Built-in scheduler with idempotency, send windows, and automatic stop-on-convert.",
    icon: Clock,
  },
  {
    title: "BYO Resend",
    description: "Use your own Resend API key. No email infrastructure to manage.",
    icon: Key,
  },
  {
    title: "Developer-First",
    description: "Simple REST API. No UI needed. Perfect for engineers who code their growth stack.",
    icon: Zap,
  },
  {
    title: "Conversion Tracking",
    description: "One event call stops all future sends instantly. Built for product-led growth.",
    icon: Target,
  },
  {
    title: "10-Minute Setup",
    description: "Three API calls. That's it. Generate, enroll, convert. Ship lifecycle emails today.",
    icon: Rocket,
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32 container">
      <div className="text-center mb-16 md:mb-20">
        <Pill className="mb-6">FEATURES</Pill>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-sentient">
          Built for <i className="font-light">developers</i>
        </h2>
        <p className="font-mono text-sm sm:text-base text-foreground/60 mt-6 max-w-[600px] mx-auto">
          Skip the marketing automation bloat. Get AI-powered email journeys through clean APIs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={index}
              className="group relative border border-border bg-[#0a0a0a]/50 backdrop-blur-sm p-8 hover:border-primary/30 transition-all duration-300"
            >
              <IconComponent className="w-10 h-10 mb-4 text-primary" />
              <h3 className="font-sentient text-2xl mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="font-mono text-sm text-foreground/60 leading-relaxed">
                {feature.description}
              </p>
              <div className="absolute inset-0 bg-gradient-to-b from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          );
        })}
      </div>
    </section>
  );
}

