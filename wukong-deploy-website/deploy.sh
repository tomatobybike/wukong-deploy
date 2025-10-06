#!/bin/bash
# deploy.sh - 安全部署 Docusaurus 网站到 GitHub Pages
# ⚠️ 假设依赖已经安装

set -e

DEV_BRANCH="main"
DEPLOY_BRANCH="gh-pages"
REPO_URL="git@github.com:tomatobybike/wukong-deploy.git"

echo "当前分支: $(git branch --show-current)"

# 1. 切换到开发分支
git checkout $DEV_BRANCH
git pull origin $DEV_BRANCH

# 2. 构建网站
echo "构建静态网站..."
yarn build

# 3. 检查远程 gh-pages 分支是否存在
if ! git ls-remote --exit-code --heads $REPO_URL $DEPLOY_BRANCH > /dev/null; then
  echo "远程 gh-pages 分支不存在，创建空分支..."
  git checkout --orphan $DEPLOY_BRANCH
  git rm -rf .
  git commit --allow-empty -m "Init gh-pages"
  git push origin $DEPLOY_BRANCH
  git checkout $DEV_BRANCH
fi

# 4. 部署
echo "部署到 $DEPLOY_BRANCH..."
yarn deploy

echo "部署完成！访问: https://tomatobybike.github.io/wukong-deploy/"
