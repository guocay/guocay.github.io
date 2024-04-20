import {hopeTheme} from "vuepress-theme-hope";
import {zhNavbar} from "./navbar";
import {zhSidebar} from "./sidebar";

export default hopeTheme({
	hostname: "https://blog.guocay.com",

	author: {
		name: "GuoCay",
		email: "guocay@gmail.com",
	},

	iconAssets: "iconify",

	logo: "/favicon.ico",

	repo: "guocay",

	repoDisplay: true,

	docsDir: "docs",

	blog: {
		timeline: "不积跬步,无以至千里...",
		medias: {
			Github: "https://github.com/guocay",
			Gitee: "https://gitee.com/guocay",
			Zhihu: "https://zhihu.com/people/guocay",
			Twitter: "https://twitter.com/guocay",
			Gmail: "mailto:guocay@gmail.com"
		},
	},

	// 是否开启选择主题色
	themeColor: true,

	// 全屏按钮
	fullscreen: true,

	locales: {
		/**
		 * Chinese locale config
		 */
		"/": {
			// navbar
			navbar: zhNavbar,
			navbarLayout: {
				start: ["Brand"],
				center: ["Search"],
				// "Language",
				end: ["Links", "Outlook", "Repo"]
			},

			// sidebar
			sidebar: zhSidebar,

			displayFooter: true,

			blog: {
				description: "一个后端开发程序员",
				intro: "/intro.html",
			},
			pageInfo: ["Original", "Author", "Date", "Word", "Category", "Tag"],

			editLink: false,

			prevLink: true,

			nextLink: true,

			contributors: false,

			lastUpdated: false,
		},
	},

	encrypt: {
		config: {
			"/demo/encrypt.html": ["1234"],
			"/zh/demo/encrypt.html": ["1234"],
		},
	},

	plugins: {
		blog: {
			excerpt: true,
		},

		// 评论系统
		comment: {
			// provider: "Giscus",
		},

		// 搜索相关的配置
		searchPro: {
			// 索引全部内容
			indexContent: true,
			autoSuggestions: true,

			// 禁用快捷按键
			hotKeys: [],

			// 语言选择
			locales: {
				"/": {
					// 设置搜索框文本为空
					// search: ''
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
		},

		// MD文件增强配置
		mdEnhance: {
			align: true,
			attrs: true,
			codetabs: true,
			demo: true,
			figure: true,
			gfm: true,
			imgLazyload: true,
			imgSize: true,
			include: true,
			mark: true,
			playground: {
				presets: ["ts", "vue"],
			},
			stylize: [
				{
					matcher: "Recommended",
					replacer: ({tag}) => {
						if (tag === "em")
							return {
								tag: "Badge",
								attrs: {type: "tip"},
								content: "Recommended",
							};
					},
				},
			],
			sub: true,
			sup: true,
			tabs: true,
			vPre: true
		},

		// SEO增强配置
		seo: {

		},

		// 阅读时间及字数配置
		readingTime: {

		},

		// 检测无效链接
		linksCheck: {

		},


	}
});
