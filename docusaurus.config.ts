import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Self-hosted configuration - No external dependencies

const config: Config = {
  title: 'LanOnasis Documentation',
  tagline: 'Memory as a Service Platform',
  favicon: 'img/favicon.ico',

  // Production URL
  url: 'https://docs.LanOnasis.com',
  baseUrl: '/',

  // No GitHub pages - we're self-hosting
  organizationName: 'LanOnasis',
  projectName: 'docs-LanOnasis',

  onBrokenLinks: 'warn',
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
          showLastUpdateTime: false,
          showLastUpdateAuthor: false,
        },
        blog: false, // Disable blog - docs only
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // LanOnasis branding
    image: 'img/LanOnasis-social-card.jpg',
    navbar: {
      title: 'LanOnasis Docs',
      logo: {
        alt: 'LanOnasis Logo',
        src: 'img/logo.png',
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
          href: 'https://dashboard.LanOnasis.com',
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
              href: 'https://dashboard.LanOnasis.com',
            },
            {
              label: 'API Gateway',
              href: 'https://api.LanOnasis.com',
            },
            {
              label: 'MCP Interface',
              href: 'https://mcp.LanOnasis.com',
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
              href: 'https://status.LanOnasis.com',
            },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} LanOnasis. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
