#!/bin/bash
# deploy.sh - 安全部署 Docusaurus 网站到 GitHub Pages

set -e

# ⚠️ 请确认你的开发分支名称
DEV_BRANCH="main"
DEPLOY_BRANCH="gh-pages"

echo "当前分支: $(git branch --show-current)"

# 1. 如果在 gh-pages 分支，切换到开发分支
if [ "$(git branch --show-current)" = "$DEPLOY_BRANCH" ]; then
  echo "你当前在 $DEPLOY_BRANCH 分支，切换到 $DEV_BRANCH..."
  git checkout $DEV_BRANCH
fi

# 2. 更新代码
echo "拉取最新代码..."
git pull origin $DEV_BRANCH

# 3. 安装依赖
echo "安装依赖..."
yarn install

# 4. 构建网站
echo "构建静态网站..."
yarn build

# 5. 部署到 gh-pages
echo "部署到 $DEPLOY_BRANCH..."
yarn deploy

echo "部署完成！访问: https://tomatobybike.github.io/wukong-deploy/"
