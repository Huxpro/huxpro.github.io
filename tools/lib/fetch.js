import http from 'http';

export default async(url) => new Promise((resolve, reject) =>
	http.get(url, res => resolve(res)).on('error', err => reject(err))
);
