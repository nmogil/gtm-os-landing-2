'use client'

import dynamic from "next/dynamic";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { Benefits } from "@/components/benefits";
import { WaitlistCTA } from "@/components/waitlist-cta";
import { Footer } from "@/components/footer";

// Lazy load Leva debug panel
const Leva = dynamic(() => import("leva").then((mod) => mod.Leva), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Hero />
      {/* Solid black background for content sections to improve readability */}
      <div className="relative bg-gradient-to-b from-black/0 via-black to-black pt-24 -mt-24 z-10">
        <Features />
        <HowItWorks />
        <Benefits />
      </div>
      <WaitlistCTA />
      <Footer />
      <Leva hidden />
    </>
  );
}
