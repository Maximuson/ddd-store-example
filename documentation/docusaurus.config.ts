import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'DDD Store Example',
  tagline: 'Educational DDD / Clean Architecture monorepo',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://maximuson.github.io',
  baseUrl: '/ddd-store-example/',
  organizationName: 'maximuson',
  projectName: 'ddd-store-example',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/maximuson/ddd-store-example/tree/main/documentation/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'DDD Store Example',
      logo: {
        alt: 'DDD Store Example',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/maximuson/ddd-store-example',
          label: 'GitHub',
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
              to: '/docs/intro',
            },
            {
              label: 'Architecture',
              to: '/docs/architecture',
            },
          ],
        },
        {
          title: 'Repository',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/maximuson/ddd-store-example',
            },
            {
              label: 'Source (documentation/)',
              href: 'https://github.com/maximuson/ddd-store-example/tree/main/documentation',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} DDD Store Example. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
