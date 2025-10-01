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
      <Features />
      <HowItWorks />
      <CodeExample />
      <Benefits />
      <WaitlistCTA />
      <Footer />
      <Leva hidden />
    </>
  );
}
