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
    },
    {
      type: 'category',
      label: 'Configuration',
      items: ['configuration/config-file', 'configuration/env-variables'],
    },
    {
      type: 'category',
      label: 'Advanced Features',
      items: ['advanced/multi-server', 'advanced/error-handling'],
    },
    {
      type: 'category',
      label: 'Best Practices',
      items: ['best-practices/project-structure'],
    },
    {
      type: 'category',
      label: 'Examples',
      items: ['examples/use-cases'],
    },
  ],
};

export default sidebars;
