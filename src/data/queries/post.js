import fs from 'fs'
import {join} from 'path'
import Promise from 'bluebird'
import fm from 'front-matter'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

import {
	GraphQLString as StringType,
	GraphQLNonNull as NonNull,
} from 'graphql'

import PostType from '../types/PostType'

import {header, initial} from '../config/postConfig'

const POST_DIR = join(__dirname, './posts');

const readFile = Promise.promisify(fs.readFile);
const fileExists = filename => new Promise(resolve => {
	fs.exists(filename, resolve);
});

const md = new MarkdownIt({
	highlight: function (str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return '<pre class="hljs"><code>' +
					hljs.highlight(lang, str, true).value +
					'</code></pre>';
			} catch (__) {
			}
		}

		return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
	}
});


const parseContent = (path, fileContent) => {
	const fmContent = fm(fileContent);
	let htmlContent = md.render(fmContent.body);
	const a = fmContent.attributes;
	let h = {type: 'post'}, i = {};
	header.map((value) => {
		if (a[value]) {
			h[value] = a[value];
		}
	});
	initial.map((value) => {
		if (a[value]) {
			i[value] = a[value];
		}
	});

	return Object.assign({path, content: htmlContent}, {header: h, initial: i});
};

async function resolveExtension(path, extension) {
	let fileNameBase = join(POST_DIR, `${path === '/' ? '/index' : path}`);
	let ext = extension;
	if (!ext.startsWith('.')) {
		ext = `.${extension}`;
	}

	let fileName = fileNameBase + ext;

	if (!(await fileExists(fileName))) {
		fileNameBase = join(POST_DIR, `${path}/index`);
		fileName = fileNameBase + ext;
	}

	if (!(await fileExists(fileName))) {
		return {success: false};
	}

	return {success: true, fileName};
}

async function resolveFileName(path) {
	const extension = '.md';

	const maybeFileName = await resolveExtension(path, extension);
	if (maybeFileName.success) {
		return {success: true, fileName: maybeFileName.fileName, extension};
	}

	return {success: false, fileName: null, extension: null};
}

const post = {
	type: PostType,
	args: {
		path: {type: new NonNull(StringType)},
	},
	async resolve({request}, {path}) {
		const {success, fileName, extension} = await resolveFileName(path);
		if (!success) {
			return null;
		}

		const source = await readFile(fileName, {encoding: 'utf8'});
		return parseContent(path, source, extension);
	},
};

export default post;




