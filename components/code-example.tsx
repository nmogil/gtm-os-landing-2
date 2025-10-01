"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const examples = [
  {
    label: "Node.js",
    language: "javascript",
    code: `// Generate an email journey
const response = await fetch('https://api.gtmos.dev/journeys', {
  method: 'POST',
  headers: {
    'X-API-Key': process.env.GTM_OS_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    goal: 'Convert trial users to paid',
    audience: 'B2B SaaS trials',
    options: { emails: 5 }
  })
});

const { journey_id, stages } = await response.json();
// Stages include subjects, bodies, timing - ready to send`,
  },
  {
    label: "Python",
    language: "python",
    code: `# Enroll a contact into journey
import requests

response = requests.post(
  'https://api.gtmos.dev/enrollments',
  headers={
    'X-API-Key': os.getenv('GTM_OS_KEY'),
    'Content-Type': 'application/json'
  },
  json={
    'journey_id': 'jrn_123',
    'contact': {
      'email': 'user@company.com',
      'data': {'name': 'Sarah', 'company': 'Acme'}
    }
  }
)

enrollment = response.json()
# Scheduler handles the rest automatically`,
  },
  {
    label: "cURL",
    language: "bash",
    code: `# Stop sends on conversion
curl -X POST https://api.gtmos.dev/events \\
  -H "X-API-Key: $GTM_OS_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "conversion",
    "contact_email": "user@company.com",
    "journey_id": "jrn_123"
  }'

# Future sends stop within 60 seconds`,
  },
];

export function CodeExample() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="example" className="relative py-24 md:py-32 bg-[#0a0a0a]/30">
      <div className="container">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-sentient">
            See it in <i className="font-light">action</i>
          </h2>
          <p className="font-mono text-sm sm:text-base text-foreground/60 mt-6 max-w-[600px] mx-auto">
            Simple, predictable API calls. No SDKs required.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`font-mono text-sm px-4 py-2 border transition-colors ${
                  activeTab === index
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-transparent border-border/50 text-foreground/60 hover:text-foreground/80 hover:border-border'
                }`}
              >
                {example.label}
              </button>
            ))}
          </div>

          <div className="bg-[#0a0a0a] border border-border">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-border/50">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="overflow-x-auto">
              <SyntaxHighlighter
                language={examples[activeTab].language}
                style={oneDark}
                customStyle={{
                  margin: 0,
                  padding: "1.5rem",
                  background: "transparent",
                  fontSize: "0.875rem",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "var(--font-geist-mono), monospace",
                  },
                }}
              >
                {examples[activeTab].code}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

