import {hopeTheme} from "vuepress-theme-hope";
import {zhNavbar} from "./navbar";
import {zhSidebar} from "./sidebar";

export default hopeTheme({
	hostname: "https://guocay.github.io",

	author: {
		name: "GuoCay",
		email: "guocay@gmail.com",
	},

	iconAssets: "iconfont",

	logo: "/favicon.png",

	repo: "guocay",

	repoDisplay: true,

	docsDir: "docs",

	blog: {
		timeline: "不积跬步,无以至千里...",
		medias: {
			GitHub: "https://github.com/guocay",
			Gitee: "https://gitee.com/guocay",
			Gmail: "mailto:guocay@gmail.com",
			Zhihu: "https://www.zhihu.com/people/CoderGk",
			Twitter: "https://twitter.com/guocay",
			// Evernote: "https://example.com",
			// Linkedin: "https://example.com",
			// BiliBili: "https://example.com",
			// Dingding: "https://example.com",
			// Baidu: "https://example.com",
			// Bitbucket: "https://example.com",
			// Discord: "https://example.com",
			// Dribbble: "https://example.com",
			// Email: "mailto:info@example.com",
			// Facebook: "https://example.com",
			// Flipboard: "https://example.com",
			// Gitlab: "https://example.com",
			// Instagram: "https://example.com",
			// Lark: "https://example.com",
			// Lines: "https://example.com",
			// Pinterest: "https://example.com",
			// Pocket: "https://example.com",
			// QQ: "https://example.com",
			// Qzone: "https://example.com",
			// Reddit: "https://example.com",
			// Rss: "https://example.com",
			// Steam: "https://example.com",
			// Twitter: "https://example.com",
			// Wechat: "https://example.com",
			// Weibo: "https://example.com",
			// Whatsapp: "https://example.com",
			// Youtube: "https://example.com",
		},
	},

	// 主题色
	themeColor: {
		blue: "#2196f3",
		red: "#f26d6d",
		green: "#3eaf7c",
		orange: "#fb9b5f",
	},

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

		comment: {
			// provider: "Giscus",
		},

		// all features are enabled for demo, only preserve features you need here
		mdEnhance: {
			align: true,
			attrs: true,
			chart: true,
			codetabs: true,
			demo: true,
			echarts: true,
			figure: true,
			flowchart: true,
			gfm: true,
			imgLazyload: true,
			imgSize: true,
			include: true,
			katex: true,
			mark: true,
			mermaid: true,
			playground: {
				presets: ["ts", "vue"],
			},
			presentation: {
				plugins: ["highlight", "math", "search", "notes", "zoom"],
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
			vPre: true,
			vuePlayground: true,
		},
	},
});
