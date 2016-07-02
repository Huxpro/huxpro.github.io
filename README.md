#Hux Blog

###[View Live Hux Blog &rarr;](http://huxpro.github.io)

![](http://huangxuan.me/img/blog-desktop.jpg)

### Server Side Rendering

This pr is kind of a customize edition of React Starter Kit, with some additional techs such as react-router/redux...

This edition may not be fitful for man that knows nothing about code, but its perfect for the one who has a cloud server

And  its main highlights r the SPA UE and load speed.

### Construction

config.yml of jekyll now generally become src/constants/index.js, maybe should name it siteConfig? whatever..

* tools some constructors tool file using with babel-node 

* src
 
		actions/reducers/store: redux part
	
		components: React Components
		
		data/core: GraphQL and some other things..
		
		content/post/public: ...
		
		views: jade template

### Diff and issues

Footer section without github snap (for dev)

Portfolio page just has 3 parts in, and skill icon font is beyond my ability

SEO part  done nothing ... 

Markdown-it has some conflict with the original md file

keynote type Post .... 

Comment...

### At last

For lacking of front-end coding experience so I pull the request with bunches of issues.

Wish there will be some advise?
