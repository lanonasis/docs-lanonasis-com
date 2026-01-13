import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import yaml from 'js-yaml';
import path from 'path';

// Polyfill for gray-matter expecting `yaml.safeLoad` (removed in js-yaml@4)
// Keep the override on js-yaml v4 while preserving Docusaurus frontmatter parsing.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(yaml as any).safeLoad = (yaml as any).load;

// Self-hosted configuration - No external dependencies

const config: Config = {
  title: 'LanOnasis Documentation',
  tagline: 'Memory as a Service Platform',
  favicon: 'img/favicon.ico',

  // Production URL
  url: 'https://docs.lanonasis.com',
  baseUrl: '/',

  // No GitHub pages - we're self-hosting
  organizationName: 'LanOnasis',
  projectName: 'docs-LanOnasis',

  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'ignore',

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
          // Enable GitHub editing
          editUrl: 'https://github.com/lanonasis/docs-lanonasis-com/edit/main/',
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
  plugins: [
    () => ({
      name: 'path-to-regexp-default-export',
      configureWebpack() {
        return {
          resolve: {
            alias: {
              'path-to-regexp$': path.resolve(
                __dirname,
                'src/utils/path-to-regexp-default.js'
              ),
            },
          },
        };
      },
    }),
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
          type: 'doc',
          docId: 'v-secure/intro',
          position: 'left',
          label: 'v-secure',
        },
        {
          to: '/api/playground',
          position: 'left',
          label: 'API Playground',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          label: 'Dashboard',
          href: 'https://dashboard.lanonasis.com',
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
            {
              label: 'v-secure',
              to: '/v-secure/intro',
            },
          ],
        },
        {
          title: 'Platform',
          items: [
            {
              label: 'Dashboard',
              href: 'https://dashboard.lanonasis.com',
            },
            {
              label: 'API Gateway',
              href: 'https://api.lanonasis.com',
            },
            {
              label: 'MCP Interface',
              href: 'https://mcp.lanonasis.com',
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
              href: 'https://status.lanonasis.com',
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
