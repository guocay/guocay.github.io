import {defineUserConfig} from "vuepress";
import {searchProPlugin} from "vuepress-plugin-search-pro";
import theme from "./theme.js";

export default defineUserConfig({
	base: "/",

	// 输出目录
	// dest: "dist",

	// 基础信息
	lang: "zh-CN",
	title: "GuoCay",
	description: "guocay's personal blog.",

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
