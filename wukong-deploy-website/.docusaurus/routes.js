import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/wukong-deploy/en/blog',
    component: ComponentCreator('/wukong-deploy/en/blog', '2c1'),
    exact: true
  },
  {
    path: '/wukong-deploy/en/blog/archive',
    component: ComponentCreator('/wukong-deploy/en/blog/archive', 'e68'),
    exact: true
  },
  {
    path: '/wukong-deploy/en/blog/authors',
    component: ComponentCreator('/wukong-deploy/en/blog/authors', 'e89'),
    exact: true
  },
  {
    path: '/wukong-deploy/en/blog/authors/all-sebastien-lorber-articles',
    component: ComponentCreator('/wukong-deploy/en/blog/authors/all-sebastien-lorber-articles', '0e5'),
    exact: true
  },
  {
    path: '/wukong-deploy/en/blog/authors/yangshun',
    component: ComponentCreator('/wukong-deploy/en/blog/authors/yangshun', '081'),
    exact: true
  },
  {
    path: '/wukong-deploy/en/blog/first-blog-post',
    component: ComponentCreator('/wukong-deploy/en/blog/first-blog-post', 'a32'),
    exact: true
  },
  {
    path: '/wukong-deploy/en/blog/long-blog-post',
    component: ComponentCreator('/wukong-deploy/en/blog/long-blog-post', '4ac'),
    exact: true
  },
  {
    path: '/wukong-deploy/en/blog/mdx-blog-post',
    component: ComponentCreator('/wukong-deploy/en/blog/mdx-blog-post', 'a4f'),
    exact: true
  },
  {
    path: '/wukong-deploy/en/blog/tags',
    component: ComponentCreator('/wukong-deploy/en/blog/tags', '4d5'),
    exact: true
  },
  {
    path: '/wukong-deploy/en/blog/tags/docusaurus',
    component: ComponentCreator('/wukong-deploy/en/blog/tags/docusaurus', '725'),
    exact: true
  },
  {
    path: '/wukong-deploy/en/blog/tags/facebook',
    component: ComponentCreator('/wukong-deploy/en/blog/tags/facebook', '67a'),
    exact: true
  },
  {
    path: '/wukong-deploy/en/blog/tags/hello',
    component: ComponentCreator('/wukong-deploy/en/blog/tags/hello', '88e'),
    exact: true
  },
  {
    path: '/wukong-deploy/en/blog/tags/hola',
    component: ComponentCreator('/wukong-deploy/en/blog/tags/hola', 'dd1'),
    exact: true
  },
  {
    path: '/wukong-deploy/en/blog/welcome',
    component: ComponentCreator('/wukong-deploy/en/blog/welcome', '106'),
    exact: true
  },
  {
    path: '/wukong-deploy/en/markdown-page',
    component: ComponentCreator('/wukong-deploy/en/markdown-page', 'e07'),
    exact: true
  },
  {
    path: '/wukong-deploy/en/docs',
    component: ComponentCreator('/wukong-deploy/en/docs', '06f'),
    routes: [
      {
        path: '/wukong-deploy/en/docs',
        component: ComponentCreator('/wukong-deploy/en/docs', '225'),
        routes: [
          {
            path: '/wukong-deploy/en/docs',
            component: ComponentCreator('/wukong-deploy/en/docs', '68a'),
            routes: [
              {
                path: '/wukong-deploy/en/docs/category/tutorial---basics',
                component: ComponentCreator('/wukong-deploy/en/docs/category/tutorial---basics', '1bf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wukong-deploy/en/docs/category/tutorial---extras',
                component: ComponentCreator('/wukong-deploy/en/docs/category/tutorial---extras', 'b54'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wukong-deploy/en/docs/intro',
                component: ComponentCreator('/wukong-deploy/en/docs/intro', '9b5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wukong-deploy/en/docs/tutorial-basics/congratulations',
                component: ComponentCreator('/wukong-deploy/en/docs/tutorial-basics/congratulations', '7ac'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wukong-deploy/en/docs/tutorial-basics/create-a-blog-post',
                component: ComponentCreator('/wukong-deploy/en/docs/tutorial-basics/create-a-blog-post', '91d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wukong-deploy/en/docs/tutorial-basics/create-a-document',
                component: ComponentCreator('/wukong-deploy/en/docs/tutorial-basics/create-a-document', '1aa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wukong-deploy/en/docs/tutorial-basics/create-a-page',
                component: ComponentCreator('/wukong-deploy/en/docs/tutorial-basics/create-a-page', '8e9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wukong-deploy/en/docs/tutorial-basics/deploy-your-site',
                component: ComponentCreator('/wukong-deploy/en/docs/tutorial-basics/deploy-your-site', '327'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wukong-deploy/en/docs/tutorial-basics/markdown-features',
                component: ComponentCreator('/wukong-deploy/en/docs/tutorial-basics/markdown-features', 'ed1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wukong-deploy/en/docs/tutorial-extras/manage-docs-versions',
                component: ComponentCreator('/wukong-deploy/en/docs/tutorial-extras/manage-docs-versions', 'b03'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wukong-deploy/en/docs/tutorial-extras/translate-your-site',
                component: ComponentCreator('/wukong-deploy/en/docs/tutorial-extras/translate-your-site', 'b4f'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/wukong-deploy/en/',
    component: ComponentCreator('/wukong-deploy/en/', 'ad4'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
