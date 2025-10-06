// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'getting-started/introduction',
      label: '介绍',
    },
    {
      type: 'category',
      label: '配置指南',
      items: [
        'configuration/config-file',
        'configuration/env-variables',
      ],
    },
    {
      type: 'category',
      label: '高级功能',
      items: [
        'advanced/multi-server',
        'advanced/error-handling',
      ],
    },
    {
      type: 'category',
      label: '最佳实践',
      items: [
        'best-practices/project-structure',
      ],
    },
    {
      type: 'category',
      label: '示例',
      items: [
        'examples/use-cases',
      ],
    },
  ],
};

export default sidebars;
