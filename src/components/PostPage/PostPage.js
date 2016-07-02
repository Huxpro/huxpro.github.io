import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './PostPage.scss'
import AnchorJS from '../../core/anchor'
import catalogG from './catalog'
import {
	catalogToggle as toggle,
	changeCatalogFixState as fix,
} from '../../actions'
import {addEventListener, removeEventListener} from '../../core/DOMUtils';

import Row from '../../core/Row'
import Header from '../Header'
import SidebarTags from '../SidebarTags'
import Friends from '../Friends'
import Pager from '../Pager'
import {tags, friends, listLite as list, siteTitle as title} from '../../constants'

// import onePageNav from './navtest'     TODO: balabala...

class PostPage extends Component {

	constructor() {
		super();
		this._handleScroll = this.handleScroll.bind(this);
	}

	static propTypes = {
		header: PropTypes.object.isRequired,
		content: PropTypes.string.isRequired,
	};

	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired,
	};

	componentWillMount() {
		this.context.onSetTitle(`${this.props.header.title} - ${this.props.static.title}`);
	}

	componentDidMount() {


		// *
		// TODO: anchor.js operate DOM after SSR loaded, feeling bad because my intuition
		// --------------------------------------------------------------------------------
		const anchors = new AnchorJS({
			visible: 'always',
			placement: 'left',
			icon: '#',
		});
		anchors.add().remove('header h1').remove('.hidden-lg-down h5').remove('section h5');

		if (window.innerWidth >= 1200) {
			catalogG();
			addEventListener(window, 'scroll', this._handleScroll);
		}


		// *
		// TODO: one page nav thing...
		// --------------------------------------------------------------------------------

		// const catalogBody = document.querySelector('#catalog-body');
		//
		// let navTest = new onePageNav(catalogBody, {
		// 	currentClass: s.active,
		// 	changeHash: !1,
		// 	easing: "swing",
		// 	filter: "",
		// 	scrollSpeed: 700,
		// 	scrollOffset: 0,
		// 	scrollThreshold: .2,
		// 	begin: null,
		// 	end: null,
		// 	scrollChange: null,
		// 	padding: 80
		// });
		//
		// navTest.init();
	}

	componentWillUnmount() {
		if (window.innerWidth >= 1200) {
			removeEventListener(window, 'scroll', this._handleScroll);
			console.log('unmount');
		}

	}

	render() {
		const {header, catalog} = this.props;
		const {tags, friends, list} = this.props.static;
		let previous = {}, next = {};
		let pos = -1;
		list.map((value, index) => {
			if (value.title === header.title) {
				pos = index;
			}
		});
		if (pos !== -1) {
			previous = pos === list.length - 1 ? {} : {
				to: list[pos + 1].path,
				text: 'PREVIOUS',
				sub: list[pos + 1].title,
			};
			next = pos === 0 ? {} : {
				to: list[pos - 1].path,
				text: 'NEXT',
				sub: list[pos - 1].title,
			};
		}
		return (
			<div className={s.root}>
				<Header style={header}/>
				<Row>
					<div>
						<div className="col-xl-8 offset-xl-2 col-lg-10 offset-lg-1">
							<article
								className={s.post}
								dangerouslySetInnerHTML={{ __html: this.props.content || '' }}/>
						</div>
						<div className="col-xl-2 offset-xl-0 hidden-lg-down">
							<div className={`${s.catalog} ${catalog.toggle ? s.fold : ''} ${catalog.fixed? s.fixed : ''}`}
									 style={{display: 'none'}}>
								<hr/>
								<h5 id={s.catalogBrand}>
									<a href="#" className={s.catalogToggle}
										 onClick={(e) => this.catalogToggle(e)}>CATALOG</a>
								</h5>
								<ul id="catalog-body" className={s.catalogBody}>

								</ul>
							</div>
						</div>
						<div className="col-xl-8 offset-xl-2 col-lg-10 offset-lg-1">
							<Pager index={false} previous={previous} next={next}/>
							<SidebarTags tags={tags}/>
							<Friends friends={friends}/>
						</div>
					</div>
				</Row>
			</div>
		)
	}

	catalogToggle(e) {
		e.preventDefault();
		this.props.toggle();
	}

	handleScroll() {
		const catalog = document.querySelector(`.${s.catalog}`);

		if (catalog) {
			let currentTop = window.scrollY;
			if (currentTop > document.querySelector('header').clientHeight + 41 && !this.props.catalog.fixed) {
				this.props.fix(true);
			}
			if (currentTop <= document.querySelector('header').clientHeight + 41 && this.props.catalog.fixed) {
				this.props.fix(false);
			}

			if (catalog.style.display === 'none') {
				console.log('test');
				catalog.style.display = 'block';
			}
		}
	}
}

function mapState(state) {
	return {
		static: {
			tags,
			list,
			friends,
			title,
		},
		catalog: state.catalog,
	}
}



export default connect(mapState, {toggle, fix})(withStyles(PostPage, s))

