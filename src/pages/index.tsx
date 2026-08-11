import type { ComponentType, ReactNode } from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import CodeBlock from "@theme/CodeBlock";

import styles from "./index.module.css";

// Type-safe Link wrapper
const NavLink = Link as unknown as ComponentType<{
  className?: string;
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
  children?: ReactNode;
}>;

// Verified platform interfaces
const STATS = [
  { value: "REST", label: "Memory API" },
  { value: "MCP", label: "Agent tools" },
  { value: "OAuth", label: "Interactive auth" },
  { value: "API keys", label: "Automation auth" },
];

// Service cards
const SERVICES = [
  {
    icon: "🧠",
    title: "Memory Service",
    description: "Store, retrieve, and semantically search durable context for applications and AI agents.",
    link: "/memory/overview",
    badge: "Core",
  },
  {
    icon: "🔗",
    title: "MCP Server",
    description: "Connect AI assistants to memory operations through the Model Context Protocol.",
    link: "/mcp/overview",
    badge: "Agents",
  },
  {
    icon: "🔐",
    title: "Authentication",
    description: "Use OAuth for interactive sessions or scoped API keys for applications and automation.",
    link: "/auth/central-auth-gateway",
    badge: "Access",
  },
  {
    icon: "⌨️",
    title: "CLI & SDK",
    description: "Work with memories from the Onasis CLI or the TypeScript memory client.",
    link: "/sdks/overview",
    badge: "Developer",
  },
  {
    icon: "🖥️",
    title: "Developer Dashboard",
    description: "Manage account access and API keys from the LanOnasis dashboard.",
    link: "https://dashboard.lanonasis.com",
    badge: "Console",
  },
  {
    icon: "🛡️",
    title: "V-Secure",
    description: "Explore the security tooling documentation and current integration guidance.",
    link: "/v-secure/intro",
    badge: "Preview",
  },
];

// SDK badges
const SDKS = [
  { name: "TypeScript", icon: "🔷", link: "/sdks/typescript" },
  { name: "CLI", icon: "⌨️", link: "/sdks/cli" },
  { name: "REST API", icon: "🌐", link: "/api/overview" },
  { name: "MCP", icon: "🤖", link: "/mcp/overview" },
];

// Quick start code
const QUICK_START_CODE = `import { createMemoryClient } from '@lanonasis/memory-client';

const client = createMemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  apiKey: process.env.LANONASIS_API_KEY,
});

await client.createMemory({
  title: 'Project context',
  content: 'The deployment uses the production memory API.',
  memory_type: 'context',
  tags: ['project'],
});

const results = await client.searchMemories({
  query: 'production deployment',
  limit: 5,
});`;

function HeroSection() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroBackground}>
        <div className={styles.heroGradient} />
        <div className={styles.heroGrid} />
      </div>

      <div className={styles.heroContent}>
        <div className={styles.heroBadges}>
          <span className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Memory API + MCP
          </span>
        </div>

        <Heading as="h1" className={styles.heroTitle}>
          <span className={styles.heroTitleGradient}>LanOnasis</span>
          <br />
          <span className={styles.heroTitleSub}>Developer Platform</span>
        </Heading>

        <p className={styles.heroSubtitle}>
          Give applications and AI agents durable, searchable context through a
          focused memory API, MCP tools, CLI, and TypeScript SDK.
        </p>

        <div className={styles.heroActions}>
          <NavLink to="/intro" className={styles.heroPrimaryBtn}>
            Get Started
            <span className={styles.heroArrow}>→</span>
          </NavLink>
          <NavLink to="/api/playground" className={styles.heroSecondaryBtn}>
            API Playground
          </NavLink>
          <button
            className={styles.heroAIBtn}
            onClick={() => {
              // Open AI chat modal or redirect to chat page
              if (typeof window !== 'undefined') {
                window.open('https://claude.ai/new?q=Help%20me%20with%20LanOnasis%20API', '_blank');
              }
            }}
          >
            <span className={styles.heroAIIcon}>✨</span>
            Ask Claude
          </button>
          <NavLink
            href="https://github.com/lanonasis"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.heroGhostBtn}
          >
            GitHub
          </NavLink>
        </div>

        <div className={styles.heroStats}>
          {STATS.map((stat, idx) => (
            <div key={idx} className={styles.heroStat}>
              <span className={styles.heroStatValue}>{stat.value}</span>
              <span className={styles.heroStatLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

function ServicesSection() {
  return (
    <section className={styles.services}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Platform Services</span>
          <Heading as="h2" className={styles.sectionTitle}>
            Everything you need to build
          </Heading>
          <p className={styles.sectionSubtitle}>
            Use the supported interfaces that connect applications, operators, and AI agents to memory.
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {SERVICES.map((service, idx) => (
            <NavLink key={idx} to={service.link} className={styles.serviceCard}>
              <div className={styles.serviceHeader}>
                <span className={styles.serviceIcon}>{service.icon}</span>
                <span className={styles.serviceBadge}>
                  {service.badge}
                </span>
              </div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
              <span className={styles.serviceLink}>
                Learn more <span>→</span>
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickStartSection() {
  return (
    <section className={styles.quickStart}>
      <div className="container">
        <div className={styles.quickStartGrid}>
          <div className={styles.quickStartContent}>
            <span className={styles.sectionTag}>Quick Start</span>
            <Heading as="h2" className={styles.sectionTitle}>
              Start building in minutes
            </Heading>
            <p className={styles.sectionSubtitle}>
              Install the SDK, grab your API key, and you're ready to go.
              Our APIs are designed to be intuitive and developer-friendly.
            </p>

            <div className={styles.quickStartSteps}>
              <div className={styles.quickStartStep}>
                <span className={styles.stepNumber}>1</span>
                <div>
                  <h4>Install the SDK</h4>
                  <code>npm install @lanonasis/memory-client</code>
                </div>
              </div>
              <div className={styles.quickStartStep}>
                <span className={styles.stepNumber}>2</span>
                <div>
                  <h4>Get your API key</h4>
                  <p>Create a free account at dashboard.lanonasis.com</p>
                </div>
              </div>
              <div className={styles.quickStartStep}>
                <span className={styles.stepNumber}>3</span>
                <div>
                  <h4>Make your first request</h4>
                  <p>Create a memory, then retrieve it with semantic search</p>
                </div>
              </div>
            </div>

            <div className={styles.sdkBadges}>
              {SDKS.map((sdk, idx) => (
                <NavLink key={idx} to={sdk.link} className={styles.sdkBadge}>
                  <span>{sdk.icon}</span>
                  {sdk.name}
                </NavLink>
              ))}
            </div>
          </div>

          <div className={styles.quickStartCode}>
            <div className={styles.codeHeader}>
              <span className={styles.codeDot} />
              <span className={styles.codeDot} />
              <span className={styles.codeDot} />
              <span className={styles.codeTitle}>example.ts</span>
            </div>
            <CodeBlock language="typescript" className={styles.codeBlock}>
              {QUICK_START_CODE}
            </CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

function APIHighlightSection() {
  return (
    <section className={styles.apiHighlight}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>API First</span>
          <Heading as="h2" className={styles.sectionTitle}>
            Designed for developers
          </Heading>
          <p className={styles.sectionSubtitle}>
            RESTful APIs with consistent patterns, comprehensive documentation, and interactive playground.
          </p>
        </div>

        <div className={styles.apiFeatures}>
          <div className={styles.apiFeature}>
            <div className={styles.apiFeatureIcon}>📖</div>
            <h3>OpenAPI Spec</h3>
            <p>Full OpenAPI 3.1 specification for code generation and tooling integration.</p>
          </div>
          <div className={styles.apiFeature}>
            <div className={styles.apiFeatureIcon}>🔄</div>
            <h3>Idempotency</h3>
            <p>Built-in idempotency keys to safely retry requests without duplicate operations.</p>
          </div>
          <div className={styles.apiFeature}>
            <div className={styles.apiFeatureIcon}>🔑</div>
            <h3>Scoped access</h3>
            <p>Authenticate with OAuth or API keys and apply personal, team, or enterprise memory context.</p>
          </div>
          <div className={styles.apiFeature}>
            <div className={styles.apiFeatureIcon}>🤖</div>
            <h3>MCP tools</h3>
            <p>Expose supported memory operations to compatible AI clients and agents.</p>
          </div>
        </div>

        <div className={styles.apiCTA}>
          <NavLink to="/api/playground" className={styles.heroPrimaryBtn}>
            Try the API Playground
            <span className={styles.heroArrow}>→</span>
          </NavLink>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <div className={styles.ctaContent}>
          <Heading as="h2" className={styles.ctaTitle}>
            Ready to build something amazing?
          </Heading>
          <p className={styles.ctaSubtitle}>
            Start with the memory API, then connect the same context to your tools and agents.
          </p>
          <div className={styles.ctaActions}>
            <NavLink to="/intro" className={styles.ctaPrimaryBtn}>
              Start Building
            </NavLink>
            <NavLink
              href="mailto:support@lanonasis.com"
              className={styles.ctaSecondaryBtn}
            >
              Contact Sales
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Developer Platform"
      description="Build applications and AI agents with durable memory, semantic search, MCP tools, and supported developer clients."
    >
      <HeroSection />
      <main>
        <ServicesSection />
        <QuickStartSection />
        <APIHighlightSection />
        <CTASection />
      </main>
    </Layout>
  );
}
