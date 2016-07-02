import s from './PostPage.scss'

function catalogGenerator() {
	let els = document.querySelector('article').querySelectorAll('h1,h2,h3,h4,h5,h6');
	const target = document.querySelector('#catalog-body');
	[].map.call(els, (value) => {
		let li = document.createElement('li');
		li.className = s[value.tagName.toLowerCase() + '-nav'];
		let a = document.createElement('a');
		a.href = '#' + value.id;
		let t = document.createTextNode(text(value.childNodes));
		a.appendChild(t);
		li.appendChild(a);
		target.appendChild(li);
	});
}

function text(e) {
	let t = '';
	e = e.childNodes || e;
	for (let i = 0, l = e.length; i < l; i++) {
		t += e[i].nodeType !== 1 ? e[i].nodeValue : text(e[i].childNodes);
	}
	return t;
}

export default catalogGenerator
