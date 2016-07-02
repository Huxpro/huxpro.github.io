import 'babel-polyfill';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressGraphQL from 'express-graphql';
import ReactDOM from 'react-dom/server';
import React from 'react';
import {createMemoryHistory, match, RouterContext} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import PrettyError from 'pretty-error';
import schema from './data/schema';
import routes from './routes';
import {Provider} from 'react-redux'
import configureStore from './store/configureStore'
import {setRuntimeVariable, setPageTypeByUrl} from './actions';
import ContextHolder from './core/ContextHolder';
import assets from './assets';
import {port, analytics} from './config';

const server = global.server = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(path.join(__dirname, 'public')));
server.use(cookieParser());
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

//
// Register API middleware
// -----------------------------------------------------------------------------
server.use('/graphql', expressGraphQL(req => ({
	schema,
	graphiql: true,
	rootValue: {request: req},
	pretty: process.env.NODE_ENV !== 'production',
})));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
server.get('*', async(req, res, next) => {
	try {
		const memoryHistory = createMemoryHistory(req.url);
		const store = configureStore({}, {cookie: req.headers.cookie}, memoryHistory);
		const history = syncHistoryWithStore(memoryHistory, store);

		match({history, routes, location: req.url}, (error, redirectLocation, renderProps) => {
			if (error) {
				throw error;
			}
			if (redirectLocation) {
				const redirectPath = `${redirectLocation.pathname}${redirectLocation.search}`;
				res.redirect(302, redirectPath);
				return;
			}
			let statusCode = 200;
			const template = require('./views/index.jade');
			const data = {title: '', description: '', css: '', body: '', entry: assets.main.js};

			if (process.env.NODE_ENV === 'production') {
				data.trackingId = analytics.google.trackingId;
			}

			store.dispatch(setRuntimeVariable((new Date()).toTimeString()));

			const css = [];
			const context = {
				insertCss: styles => css.push(styles._getCss()),
				onSetTitle: value => (data.title = value),
				onSetMeta: (key, value) => (data[key] = value),
				onPageNotFound: () => (statusCode = 404),
			};
			data.body = ReactDOM.renderToString(
				<Provider store={store}>
					<ContextHolder context={context}>
						<RouterContext {...renderProps} />
					</ContextHolder>
				</Provider>
			);
			data.css = css.join('');
			data.state = JSON.stringify(store.getState());

			res.status(statusCode);
			res.send(template(data));
		});
	} catch (err) {
		next(err);
	}
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
	console.log(pe.render(err)); // eslint-disable-line no-console
	const template = require('./views/error.jade');
	const statusCode = err.status || 500;
	res.status(statusCode);
	res.send(template({
		message: err.message,
		stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
	}));
});

//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, () => {
	/* eslint-disable no-console */
	console.log(`The server is running at http://localhost:${port}/`);
});
