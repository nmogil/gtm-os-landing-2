"use client";

import Link from "next/link";
import { GL } from "./gl";
import { Pill } from "./pill";
import { Button } from "./ui/button";
import { useState } from "react";

export function Hero() {
  const [hovering, setHovering] = useState(false);
  return (
    <div className="flex flex-col h-svh justify-between">
      <GL hovering={hovering} />

      <div className="pb-16 mt-auto text-center relative">
        <Pill className="mb-6">COMING SOON</Pill>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-sentient leading-tight">
          Email journeys that <br />
          <i className="font-light">write themselves</i>
        </h1>
        <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance mt-8 max-w-[520px] mx-auto">
          One API call generates multi-step email campaigns. <br className="hidden sm:inline" />
          AI-powered copywriting. Developer-first infrastructure.
        </p>

        <Link className="contents max-sm:hidden" href="/#waitlist">
          <Button
            className="mt-14"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            [Join Waitlist]
          </Button>
        </Link>
        <Link className="contents sm:hidden" href="/#waitlist">
          <Button
            size="sm"
            className="mt-14"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            [Join Waitlist]
          </Button>
        </Link>
      </div>
    </div>
  );
}
