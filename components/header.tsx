"use client";

import Link from "next/link";
import Image from "next/image";
import { MobileMenu } from "./mobile-menu";
import { useEffect, useState } from "react";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`fixed z-50 pt-2 md:pt-3 top-0 left-0 w-full transition-all duration-300 ${
      isScrolled ? "backdrop-blur-xl bg-background/80 shadow-lg border-b border-foreground/10" : ""
    }`}>
      <header className="flex items-center justify-between container pb-2">
        <Link href="/">
          <Image 
            src="/gtm_os_logo.svg" 
            alt="GTM OS" 
            width={120} 
            height={120} 
            className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] invert"
          />
        </Link>
        <nav className="flex max-lg:hidden absolute left-1/2 -translate-x-1/2 items-center justify-center gap-x-10">
          {["Features", "How It Works", "Example", "Benefits"].map((item) => (
            <Link
              className={`uppercase inline-block font-mono duration-150 transition-colors ease-out text-xs ${
                isScrolled
                  ? "text-foreground/80 hover:text-foreground"
                  : "text-foreground/60 hover:text-foreground/100"
              }`}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              key={item}
            >
              {item}
            </Link>
          ))}
        </nav>
        <Link className={`uppercase max-lg:hidden transition-colors ease-out duration-150 font-mono text-xs ${
          isScrolled ? "text-primary hover:text-primary/90" : "text-primary hover:text-primary/80"
        }`} href="/#waitlist">
          Join Waitlist
        </Link>
        <MobileMenu />
      </header>
    </div>
  );
};
