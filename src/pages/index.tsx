import type { ComponentType, ReactNode } from "react";
import clsx from "clsx";
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

// Stats data
const STATS = [
  { value: "99.99%", label: "Uptime SLA" },
  { value: "<50ms", label: "Avg Latency" },
  { value: "10M+", label: "API Calls/Day" },
  { value: "50+", label: "Integrations" },
];

// Service cards
const SERVICES = [
  {
    icon: "🧠",
    title: "Memory Service",
    description: "AI-native memory management with vector search, semantic understanding, and real-time sync across platforms.",
    link: "/docs/memory/overview",
    badge: "Core",
  },
  {
    icon: "💳",
    title: "Unified Payments",
    description: "Accept payments via cards, bank transfers, USSD, and mobile money with a single integration.",
    link: "/docs/unified-services/payments",
    badge: "New",
  },
  {
    icon: "🏦",
    title: "Wallets & Transfers",
    description: "Create wallets, manage balances, and send instant transfers to bank accounts via NIP.",
    link: "/docs/unified-services/wallets",
    badge: "New",
  },
  {
    icon: "🔐",
    title: "KYC Verification",
    description: "Verify customers with BVN, NIN, phone, and document verification in seconds.",
    link: "/docs/unified-services/kyc",
    badge: "New",
  },
  {
    icon: "🔗",
    title: "MCP Server",
    description: "Model Context Protocol server for AI agents. Give your LLM access to memories and services.",
    link: "/docs/mcp/overview",
    badge: "AI",
  },
  {
    icon: "🛡️",
    title: "V-Secure",
    description: "Enterprise-grade security with encryption, audit logging, and compliance controls.",
    link: "/docs/v-secure/overview",
    badge: "Enterprise",
  },
];

// SDK badges
const SDKS = [
  { name: "TypeScript", icon: "🔷", link: "/docs/sdks/typescript" },
  { name: "Python", icon: "🐍", link: "/docs/sdks/python" },
  { name: "Go", icon: "🐹", link: "/docs/sdks/go" },
  { name: "REST API", icon: "🌐", link: "/docs/api/overview" },
  { name: "MCP", icon: "🤖", link: "/docs/mcp/overview" },
];

// Quick start code
const QUICK_START_CODE = `import { LanOnasis } from '@lanonasis/sdk';

const client = new LanOnasis({ apiKey: 'sk_live_xxx' });

// Create a wallet
const wallet = await client.wallets.create({
  name: 'Customer Wallet',
  currency: 'NGN',
});

// Send a transfer
const transfer = await client.transfers.create({
  source_wallet_id: wallet.data.id,
  amount: 50000, // ₦500.00
  destination: {
    type: 'bank',
    account_number: '0123456789',
    bank_code: '058',
  },
});

console.log(\`Transfer \${transfer.data.id}: \${transfer.data.status}\`);`;

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
            All Systems Operational
          </span>
          <span className={clsx(styles.heroBadge, styles.heroBadgeNew)}>
            Unified Services API Now Live
          </span>
        </div>

        <Heading as="h1" className={styles.heroTitle}>
          <span className={styles.heroTitleGradient}>LanOnasis</span>
          <br />
          <span className={styles.heroTitleSub}>Developer Platform</span>
        </Heading>

        <p className={styles.heroSubtitle}>
          Build intelligent applications with memory management, payments, wallets,
          transfers, and KYC verification — all through a single, unified API.
        </p>

        <div className={styles.heroActions}>
          <NavLink to="/docs/intro" className={styles.heroPrimaryBtn}>
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
            One platform, multiple services. Integrate memory, payments, verification, and more.
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {SERVICES.map((service, idx) => (
            <NavLink key={idx} to={service.link} className={styles.serviceCard}>
              <div className={styles.serviceHeader}>
                <span className={styles.serviceIcon}>{service.icon}</span>
                <span className={clsx(
                  styles.serviceBadge,
                  service.badge === "New" && styles.serviceBadgeNew,
                  service.badge === "AI" && styles.serviceBadgeAI,
                  service.badge === "Enterprise" && styles.serviceBadgeEnterprise,
                )}>
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
                  <code>npm install @lanonasis/sdk</code>
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
                  <p>Create wallets, send transfers, verify identities</p>
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
            <div className={styles.apiFeatureIcon}>🪝</div>
            <h3>Webhooks</h3>
            <p>Real-time event notifications with signature verification and retry logic.</p>
          </div>
          <div className={styles.apiFeature}>
            <div className={styles.apiFeatureIcon}>⚡</div>
            <h3>Low Latency</h3>
            <p>Optimized for speed with edge deployments and efficient data structures.</p>
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
            Join thousands of developers building with LanOnasis.
            Start free, scale as you grow.
          </p>
          <div className={styles.ctaActions}>
            <NavLink to="/docs/intro" className={styles.ctaPrimaryBtn}>
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
      description="Build intelligent applications with memory management, payments, wallets, transfers, and KYC verification — all through a single, unified API."
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
