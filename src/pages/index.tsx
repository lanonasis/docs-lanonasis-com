import type { ComponentType, ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "../components/HomepageFeatures";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

// Docusaurus still ships React 18 type definitions, so we wrap Link with a
// compatible React 19 signature to keep JSX happy inside this workspace.
const CompatibleLink = Link as unknown as ComponentType<{
  className?: string;
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
  children?: ReactNode;
}>;

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <CompatibleLink
            className="button button--secondary button--lg"
            to="/intro"
          >
            Get Started with LanOnasis - 5min ⏱️
          </CompatibleLink>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Welcome to the official documentation for LanOnasis Memory-as-a-Service platform - your intelligent memory management solution."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
