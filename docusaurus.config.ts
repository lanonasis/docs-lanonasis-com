import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Self-hosted configuration - No external dependencies

const config: Config = {
  title: 'Lanonasis Documentation',
  tagline: 'Memory as a Service Platform',
  favicon: 'img/favicon.ico',

  // Self-hosted URL (no external hosting)
  url: 'http://docs.lanonasis.local',
  baseUrl: '/',

  // No GitHub pages - we're self-hosting
  organizationName: 'lanonasis',
  projectName: 'docs-lanonasis',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // Docs at root
          // No GitHub editing - everything is self-hosted
          editUrl: undefined,
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: false, // Disable blog - docs only
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Lanonasis branding
    image: 'img/lanonasis-social-card.jpg',
    navbar: {
      title: 'Lanonasis Docs',
      logo: {
        alt: 'Lanonasis Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Getting Started',
        },
        {
          type: 'doc',
          docId: 'api/overview',
          position: 'left',
          label: 'API Reference',
        },
        {
          type: 'doc',
          docId: 'sdks/overview',
          position: 'left',
          label: 'SDKs',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          label: 'Dashboard',
          href: 'http://dashboard.lanonasis.local',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/',
            },
            {
              label: 'API Reference',
              to: '/api/overview',
            },
            {
              label: 'SDKs',
              to: '/sdks/overview',
            },
          ],
        },
        {
          title: 'Platform',
          items: [
            {
              label: 'Dashboard',
              href: 'http://dashboard.lanonasis.local',
            },
            {
              label: 'API Gateway',
              href: 'http://api.lanonasis.local',
            },
            {
              label: 'MCP Interface',
              href: 'http://mcp.lanonasis.local',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Changelog',
              to: '/changelog',
            },
            {
              label: 'Support',
              to: '/support',
            },
            {
              label: 'Status',
              href: 'http://status.lanonasis.local',
            },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} Lan Onasis. Built with Docusaurus. Self-hosted with `,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
