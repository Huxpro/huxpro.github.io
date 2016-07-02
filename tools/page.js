import fs from 'fs';
import {join} from 'path';
import Promise from 'bluebird';
import fm from 'front-matter';
import replace from 'replace';

const readFile = Promise.promisify(fs.readFile);
const writeFile = Promise.promisify(fs.writeFile);
const readDir = Promise.promisify(fs.readdir);

const CONTENT_DIR = join(__dirname, '../src/posts');
const CONSTANTS_DIR = join(__dirname, '../src/constants');

const sort = function (value1, value2) {
	if (value1.date < value2.date) {
	    return 1;
	} else if (value1.date > value2.date) {
		return -1;
	} else {
		return 0;
	}
};

async function getFileList () {
	const list = await readDir(CONTENT_DIR);
	
	return list;
}

async function getPostSummary (fileName) {
	const filePath = join(CONTENT_DIR, fileName);
	const path = './' + fileName.replace('.md', '');
	const source = await readFile(filePath, {encoding: 'utf8'});
	const fmContent = fm(source);
	const summary = fmContent.body.replace(/<[^>]+>|\([^\)]+\)|\n|#|[\[]|]|\*|>|</g, '').slice(0, 200);
	return Object.assign({path, summary}, {
		author: fmContent.attributes.author,
		date: fmContent.attributes.date,
		subtitle: fmContent.attributes.subtitle,
		tags: fmContent.attributes.tags,
		title: fmContent.attributes.title,
	});
}


async function getList () {
	const result = {
		list: [],
		tags: {},
	};
	const list = await getFileList();
	console.log(list);
	for (const post of list) {
	    const summary = await getPostSummary(post);
		result.list.push(summary);
	}

	result.list = result.list.sort(sort);
	for (let [index, post] of result.list.entries()) {
		for (const tag of post.tags.values()) {
			if (!Array.isArray(result.tags[tag])) {
				result.tags[tag] = [];
			}
			result.tags[tag].push(index);
		}
	}
	return result;
}

async function page () {
	const List = await getList();
	await writeFile(join(CONSTANTS_DIR, './postList.js'), JSON.stringify(List), {encoding: 'utf-8'});
	replace({
		regex: '{"list":',
		replacement: 'export default {"list":',
		paths: ['src/constants/postList.js'],
		recursive: false,
		silent: false,
	});
}

export default page;



