// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking

// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config
import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'wukong-deploy',
  tagline: '⚡️ 一键执行远程服务器命令队列的轻量级部署工具',
  favicon: 'img/favicon.ico',
  trailingSlash: false, // 保持 URL 一致，避免 GitHub Pages 添加额外斜杠
  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://tomatobybike.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/wukong-deploy/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'tomatobybike', // Usually your GitHub org/user name.
  projectName: 'wukong-deploy', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-Hans'],
    localeConfigs: {
      en: {
        label: 'English',
        htmlLang: 'en-US',
        path: 'en',
      },
      'zh-Hans': {
        label: '中文',
        htmlLang: 'zh-CN',
        path: 'zh-Hans',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/tomatobybike/wukong-deploy/tree/main/wukong-deploy-website/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          sidebarCollapsed: false,
          breadcrumbs: true,
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
        defaultMode: 'dark',
      },
      navbar: {
        title: 'wukong-deploy',
        logo: {
          alt: 'wukong-deploy Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            to: '/docs/getting-started/introduction',
            label: 'Quick Start',
            position: 'left',
          },
          {
            to: 'docs/advanced/multi-server',
            position: 'left',
            label: 'Advanced',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/tomatobybike/wukong-deploy',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
          {
            href: 'https://www.npmjs.com/package/wukong-deploy',
            position: 'right',
            className: 'header-npm-link',
            'aria-label': 'NPM package',
          },
        ],
      },
      // docusaurus.config.js 中的 footer（替换原来的中文 footer）
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Quick Start', to: '/docs/getting-started/introduction' },
              { label: 'Configuration', to: '/docs/configuration/config-file' },
              { label: 'Best Practices', to: '/docs/best-practices/project-structure' },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub Issues',
                href: 'https://github.com/tomatobybike/wukong-deploy/issues',
              },
              { label: 'NPM Package', href: 'https://www.npmjs.com/package/wukong-deploy' },
            ],
          },
          {
            title: 'More',
            items: [
              { label: 'GitHub', href: 'https://github.com/tomatobybike/wukong-deploy' },
              {
                label: 'Feedback',
                href: 'https://github.com/tomatobybike/wukong-deploy/issues/new',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} wukong-deploy Project. Built with Docusaurus.`,
      },

      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
