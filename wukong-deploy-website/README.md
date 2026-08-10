# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

This site is published to GitHub Pages via the `gh-pages` branch. Deployment is currently done manually using the `deploy.sh` script in this directory.

### Prerequisites

- A GitHub SSH key must be configured on your machine, because the deploy pushes `gh-pages` over SSH (`git@github.com:tomatobybike/wukong-deploy.git`).
- If you only use HTTPS + token, either change `REPO_URL` in `deploy.sh` to `https://<token>@github.com/tomatobybike/wukong-deploy.git`, or set the `GIT_USER` environment variable when deploying.

### Steps

1. Commit and push the source changes to `main` (the script runs `git pull origin main` before building):

   ```bash
   git add wukong-deploy-website/
   git commit -m "chore(website): update docs"
   git push origin main
   ```

2. From the **repository root**, run the deploy script with Git Bash (or WSL) — it builds the site and pushes it to the `gh-pages` branch (creating the branch automatically on first run):

   ```bash
   bash wukong-deploy-website/deploy.sh
   ```

3. On first deploy, enable GitHub Pages in the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, then choose branch `gh-pages` / `/root` and save.

The live site is published at: **https://tomatobybike.github.io/wukong-deploy/**

### Optional: automated deployment via GitHub Actions

Instead of running the script manually, you can add a `.github/workflows/deploy.yml` that builds with `GITHUB_TOKEN` (set `permissions: contents: write`) and runs `yarn deploy` on every push to `main`, so the site is published automatically. This workflow file is not included by default.
