export function Footer() {
  return (
    <footer className="relative py-12 border-t border-border/30">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="font-sentient text-2xl mb-2">GTM OS</div>
            <p className="font-mono text-xs text-foreground/40">
              AI-powered email journeys for developers
            </p>
          </div>
          
          <div className="flex gap-8 font-mono text-xs text-foreground/60">
            <a href="mailto:hello@gtmos.dev" className="hover:text-foreground/100 transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-foreground/100 transition-colors">
              Docs
            </a>
            <a href="#" className="hover:text-foreground/100 transition-colors">
              GitHub
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border/20 text-center font-mono text-xs text-foreground/40">
          © 2025 Mogil Ventures,LLC. Built for developers who ship.
        </div>
      </div>
    </footer>
  );
}

