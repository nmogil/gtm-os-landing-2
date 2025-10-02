"use client";

import { SignupForm } from "./signup-form";

export function WaitlistCTA() {
  return (
    <section id="waitlist" className="relative py-24 md:py-32 container">
      <div className="max-w-4xl mx-auto text-center border border-primary/20 bg-primary/5 backdrop-blur-sm p-12 md:p-16">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-sentient mb-6">
          Ready to ship <br className="sm:hidden" />
          <i className="font-light">lifecycle emails?</i>
        </h2>
        <p className="font-mono text-sm sm:text-base text-foreground/60 mb-10 max-w-[500px] mx-auto">
          Join the waitlist for early access. We're launching with design partners in Q4 2025.
        </p>
        <SignupForm />
        <p className="font-mono text-xs text-foreground/40 mt-8">
          For Seed → Series A B2B SaaS teams
        </p>
      </div>
    </section>
  );
}

