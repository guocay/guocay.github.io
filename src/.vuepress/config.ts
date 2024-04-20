import {defineUserConfig} from "vuepress";
import theme from "./theme";
import viteBundler from "@vuepress/bundler-vite";
import {baiduAnalyticsPlugin} from "@vuepress/plugin-baidu-analytics";

export default defineUserConfig({
	bundler: viteBundler({
		vuePluginOptions: {},
		viteOptions: {}
	}),

	// 演示服务端口号
	port: 8080,

	// 基础信息
	base: "/",
	lang: "zh-CN",
	title: "GuoCay",
	description: "guocay's personal blog.",

	// 允许自定义模块实现
	// See https://theme-hope.vuejs.press/zh/guide/advanced/replace.html
	alias: {

	},

	plugins: [
		// 百度网站数据统计
		baiduAnalyticsPlugin({
			id: "f844401f817ffaf261c27948e9d085bc"
		})
	],
	// 主题配置
	theme
});
