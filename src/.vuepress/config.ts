import {defineUserConfig} from "vuepress";
import {searchProPlugin} from "vuepress-plugin-search-pro";
import theme from "./theme.js";

export default defineUserConfig({
	// 演示服务端口号
	port: 8080,

	// 基础信息
	base: "/",
	lang: "zh-CN",
	title: "GuoCay",
	description: "guocay's personal blog.",

	// 插件配置
	plugins: [
		searchProPlugin({
			// 索引全部内容
			indexContent: true,

			// 禁用快捷按键
			hotKeys: [],

			locales: {
				"/": {
					// 设置搜索框文本为空
					search: ''
				}
			},

			// 为分类和标签添加索引
			customFields: [
				{
					// @ts-ignore
					getter: (page) => page.frontmatter.category,
					formatter: "分类：$content",
				},
				{
					// @ts-ignore
					getter: (page) => page.frontmatter.tag,
					formatter: "标签：$content",
				},
			],

		}),
	],

	theme
});
