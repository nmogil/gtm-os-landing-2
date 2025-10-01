'use client'

import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { CodeExample } from "@/components/code-example";
import { Benefits } from "@/components/benefits";
import { WaitlistCTA } from "@/components/waitlist-cta";
import { Footer } from "@/components/footer";
import { Leva } from "leva";

export default function Home() {
  return (
    <>
      <Hero />
      {/* Solid black background for content sections to improve readability */}
      <div className="relative bg-gradient-to-b from-black/0 via-black to-black pt-24 -mt-24 z-10">
        <Features />
        <HowItWorks />
        <CodeExample />
        <Benefits />
      </div>
      <WaitlistCTA />
      <Footer />
      <Leva hidden />
    </>
  );
}
