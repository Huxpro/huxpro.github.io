import PostList from './PostList';

// *
// TODO: this lite function clearly is not the best way to get expecting things
// --------------------------------------------------------------------------------
function liteList(arr) {
	let result = [];
	for (let post of arr) {
		result.push({
			path: post.path,
			author: post.author,
			date: post.date,
			subtitle: post.subtitle,
			tags: post.tags,
			title: post.title,
		})
	}

	return result;
}

export ATs from './ActionTypes';

export const list = PostList.list;

export const listLite = liteList(list);

export const tags = PostList.tags;

export const siteTitle = 'Hux Blog';

export const SEOTitle = {
	index: '黄玄的博客 | Hux Blog',
	about: 'About - 黄玄的博客 | Hux Blog',
	tags: 'Tags - 黄玄的博客 | Hux Blog',
	portfolio: 'Portfolio - 黄玄的博客 | Hux Blog',
};

export const headers = {
	index: {
		type: 'index',
		title: 'Hux Blog',
		subtitle: '与其感慨路难行, 不如马上出发',
		image: '/img/home-bg.jpg',
		subtitle2: '',
		portrait: '',
	},
	tags: {
		type: 'tags',
		title: 'Tags',
		subtitle: '方寸之间, 自有天地',
		image: '/img/tag-bg.jpg',
		subtitle2: '',
		portrait: '',
	},
	about: {
		type: 'about',
		title: 'About',
		subtitle: 'Hey, this is Hux.',
		image: '/img/about-bg.jpg',
		subtitle2: '',
		portrait: '',
	},
	portfolio: {
		type: 'portfolio',
		title: 'Hux',
		subtitle: 'A student major in Web & Mobile,',
		image: '',
		subtitle2: 'focus on UI Development, UX Design and Motion Graphic.',
		portrait: '/img/hux_avatar.png',
	}
};

export const friends = [
	{
		title: "前端外刊评论",
		href: "http://qianduan.guru/"
	}, {
		title: "天镶的博客",
		href: "http://lingyu.wang/"
	}, {
		title: "Luke的自留地",
		href: "http://hmqk1995.github.io"
	}, {
		title: "Ebn's Blog",
		href: "http://ebnbin.com/"
	}, {
		title: "SmdCn's Blog",
		href: "http://blog.smdcn.net"
	}, {
		title: "解旻的博客",
		href: "http://xieminis.me/"
	}, {
		title: "DHong Say",
		href: "http://dhong.co"
	}, {
		title: "尹峰以为",
		href: "http://ingf.github.io/"
	}, {
		title: "前端神盾局",
		href: "http://wepiaofei.github.io/blog/"
	}
];

export const about = {
	description: "写写代码，做做设计，看看产品。世界那么大，我想去看看。",
	avatar: './img/avatar-hux.jpg',
	SNS: {
		weibo: 'huxpro',
		zhihu: 'huxpro',
		github: 'huxpro',
		facebook: 'huxpro',
	}
};

// *
// TODO: use raw html string is quiet ugly, maybe there r some better hacky methods
// --------------------------------------------------------------------------------
export const portfolio = {
	list: [
		{
			title: 'BoxOffice @Wepiao',
			time: '2015.09',
			img: 'work-wepiao-bo.jpg',
			skills: ['react'],
			link: 'http://piaofang.wepiao.com',
			content: `Wepiao Boxoffice app provides huge amounts of data and visualization of movies and cinemas including times, box office, attendance, ranking with a real-time analyzing back-end, which available on Web, iOS and Android.<br> As the <b>Lead Front-end Developer this project</b>, we built this app in the <a href="https://en.wikipedia.org/wiki/Single-page_application">Single-page Application Model</a> to provide a more fluid user experience with awesome <a href="http://facebook.github.io/react/">React.js</a>`
		}, {
			title: 'BusyWeek!',
			time: '2015.02',
			img: 'work-busyweek.jpg',
			content: `BusyWeek! is a time-based Todo application, available on Web and Apple App Store, which also support the backup and restore to and from the cloud.<br>It's material-designed, truly responsive across platforms and based on modern web technologies including HTML5, CSS3, Sass and powerful <a href="http://vuejs.org">Vue.js</a>.`,
			skills: ['vue'],
			link: 'http://huangxuan.me/BusyWeek/dist/',
		}, {
			title: 'Alitrip.com @Alibaba',
			time: '2014 - 2015',
			img: 'intern-alitrip.jpg',
			content: `Alitrip, formerly Taobao Travel, is one of the biggest platform for China's online travel sector, on which there has over 10,000 merchants providing airplane tickets, vacation packages, hotel booking services, visa application services and tour guide services.<br>As a <b>Intern Front-End Engineer</b>, I provided mobile-web and hybrid-apps development for our online travel business. Besides, I  contribute to performance, UI rendering optimization and CSS library.`,
			skills: ['kissy'],
			try: 'Alitrip',
			link: 'http://alitrip.com',
		},
	],
	icon: {
		mobile: '',
		js: '',
		react: 'logo-react.png',
		vue: 'logo-vue.png',
		kissy: 'logo-kissy.png',
	}
};


