import fs from 'fs';
import mkdirp from 'mkdirp';

const writeFile = (file, contents) => new Promise((resolve, reject) => {
	fs.writeFile(file, contents, 'utf8', err => err ? reject(err) : resolve());
});

const makeDir = (name) => new Promise((resolve, reject) => {
	mkdirp(name, err => err ? reject(err) : resolve());
});

export default {writeFile, makeDir};
