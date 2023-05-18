# Vuepress Blog
> 一个基于[Vuepress](https://vuepress.vuejs.org/zh/), 并使用[vuepress-theme-hope](https://theme-hope.vuejs.press/zh/)主题.
## 测试环境
```shell
# 启动测试服务器
pnpm run docs:dev
# 清空缓存并启动测试服务器
pnpm run docs:clean-dev
```
## 编译代码
```shell
pnpm run docs:build
```
## 自动部署
* 通过 Github Action 自动部署至Github Page
* 配置信息定义在 [website-deploy-github-pages.yml](/.github/workflows/website-deploy-github-pages.yml) 文件;
