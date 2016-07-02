import React from 'react'
import {IndexRoute, Route} from 'react-router'
import fetch from './core/fetch'
import App from './components/App'
import IndexPage from './components/IndexPage'
import TagsPage from './components/TagsPage'
import AboutPage from './components/AboutPage'
import PortfolioPage from './components/PortfolioPage'
import PostPage from './components/PostPage'
import NotFoundPage from './components/NotFoundPage'

async function getAboutComponent(location, callback) {
	const query = '/graphql?' +
		`query={content(path:"/about"){path,title,content,component}}`;
	const response = await fetch(query);
	const {data} = await response.json();

	callback(null, () => <AboutPage content={data.content.content}/>);
}


async function getPostComponent(location, callback) {
	const query = '/graphql?' +
		`query={post(path:"${location.pathname}"){path,header{type,title,tags,image,subtitle,author,date,headerMask},content}}`;
	const response = await fetch(query);
	const {data} = await response.json();

	callback(null, () => <PostPage {...data.post}/>);
}

export default (
	<Route>
		<Route path="/" component={App}>
			<IndexRoute component={IndexPage}/>
			<Route path="tags" component={TagsPage}/>
			<Route path="about" getComponent={getAboutComponent}/>
			<Route path="portfolio" component={PortfolioPage}/>
			<Route path="*" getComponent={getPostComponent}/>
		</Route>
		<Route path="*" component={NotFoundPage}/>
	</Route>
)

