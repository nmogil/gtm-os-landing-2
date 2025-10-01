"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Pill } from "./pill";
import { Button } from "./ui/button";
import { useState } from "react";

// Lazy load the GL component to reduce initial bundle size and memory usage
const GL = dynamic(() => import("./gl").then((mod) => ({ default: mod.GL })), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black" />,
});

export function Hero() {
  const [hovering, setHovering] = useState(false);
  return (
    <div className="flex flex-col h-svh justify-center items-center">
      <GL hovering={hovering} />

      <div className="text-center relative px-4 z-10">
        <div className="flex flex-col items-center">
          <Pill className="mb-6">COMING SOON</Pill>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-sentient leading-tight text-center">
            Email journeys that <br />
            <i className="font-light">write themselves</i>
          </h1>
          <p className="font-mono text-sm sm:text-base text-foreground/80 text-balance text-center mt-8 max-w-[520px] mx-auto">
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
    </div>
  );
}
