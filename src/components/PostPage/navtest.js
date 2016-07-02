import {addEventListener, removeEventListener} from '../../core/DOMUtils'
import s from './PostPage.scss'
import scroll from 'scroll'

const hasClass = (elem, cls) => (
	elem.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
);

const addClass = (elem, cls) => {
	if (!hasClass(elem, cls)) {
		elem.className += ' ' + cls;
		return !0;
	} else {
		return !1;
	}
};

const removeClass = (elem, cls) => {
	if (hasClass(elem, cls)) {
		elem.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), '');
		return !0;
	} else {
		return !1;
	}
};

const getTop = (elem) => {
	let top = elem.offsetTop;

	do {
		elem = elem.offsetParent;
		top += elem.offsetTop;
	} while (elem.offsetParent !== document.body);

	return top;
};

class OnePageNav {

	constructor(elem, options) {
		this.elem = elem;
		this.options = options;
		this.win = window;
		this.sections = {};
		this.didScroll = false;
		this.doc = document;
		this.docHeight = document.body.clientHeight;
		this.defaults = {
			navItems: 'a',
			currentClass: s.active,
			changeHash: false,
			easing: 'swing',
			filter: '',
			scrollSpeed: 750,
			scrollThreshold: 0.5,
			begin: false,
			end: false,
			scrollChange: false
		}
	}

	init() {
		this.config = Object.assign(this.options, this.defaults);
		this.nav = this.elem.querySelectorAll(this.config.navItems);
		if (this.config.filter !== '') {
			this.nav = [].filter.call(this.nav, this.config.filter);
		}
		addEventListener(this.nav, 'click.onePageNav', (e) => this.handleClick(e));
		this.getPositions();
		this.bindInterval();
		addEventListener(this.win, 'resize.onePageNav', (e) => this.getPositions(e));

		return this;
	}

	adjustNav(self, parentElem) {
		removeClass(self.elem.querySelectorAll('.' + self.config.currentClass), self.config.currentClass);
		addClass(parentElem, self.config.currentConfig);
	}

	bindInterval() {
		let self = this;
		let docHeight;

		addEventListener(self.win, 'scroll.onePageNav', function () {
			self.didScroll = true;
		})

		self.t = setInterval(function () {
			docHeight = self.doc.body.clientHeight;
			if (self.didScroll) {
				self.didScroll = false;
				self.scrollChange();
			}

			if (docHeight !== self.docHeight) {
				self.docHeight = docHeight;
				self.getPositions();
			}
		}, 250);
	}

	getHash(link) {
		return link.href.split('#')[1];
	}

	getPositions() {
		let self = this;
		let linkHref, topPos, target;
		[].map.call(self.nav, function () {
			linkHref = self.getHash(this);
			target = document.querySelector('#' + linkHref);

			if (target.length) {
				topPos = getTop(target);
				self.sections[linkHref] = Math.round(topPos);
			}
		});
	}

	getSection(windowPos) {
		let returnValue = null;
		let windowHeight = Math.round(this.win.innerHeight * this.config.scrollThreshold);

		for (let section in this.sections) {
			if ((this.sections[section] - windowHeight) < windowPos) {
				returnValue = section;
			}
		}

		return returnValue;
	}

	handleClick(e) {
		let self = this;
		let link = e.target || e.srcElement;
		let parent = link.parentNode;
		let newLoc = '#' + self.getHash(link);

		if (!hasClass(parent, self.config.currentClass)) {
			if (self.config.begin) {
				self.config.begin();
			}

			self.adjustNav(self, parent);
			self.unbindInterval();
			self.scrollTo(newLoc, function () {
				if (self.config.changeHash) {
					window.location.hash = newLoc;
				}

				self.bindInterval();

				if (self.config.end) {
					self.config.end();
				}
			});
		}

		e.preventDefault();
	}

	scrollChange() {
		let windowPos = this.win.scrollY;
		let position = this.getSection(windowPos);
		let parent;

		if (position !== null) {
			parent = this.elem.querySelector(`a[href$="#${position}"]`).parentNode;
			if (hasClass(parent, self.config.currentClass)) {
				this.adjustNav(this, parent);

				if (this.config.scrollChange) {
					this.config.scrollChange(parent);
				}
			}
		}
	}

	scrollTo(target, callback) {
		let offset = getTop(target);
		scroll.top(this.win, offset, {}, callback);
	}

	unbindInterval() {
		clearInterval(this.t);
		removeEventListener(this.win, 'scroll.onePageNav');
	}
}

export default OnePageNav
