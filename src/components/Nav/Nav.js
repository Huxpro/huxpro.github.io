import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {connect} from 'react-redux';
import {IndexLink} from 'react-router'
import s from './Nav.scss';

import ToggleButton from '../ToggleButton';
import CollapseBar from '../CollapseBar';

import {addEventListener, removeEventListener} from '../../core/DOMUtils';
import {
	changeToggleState as toggle,
	changeFixState as fix,
	changeVisibleState as visible,
} from '../../actions';
import {siteTitle as brand} from '../../constants'

class Nav extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			pre: 0,
		};
		this._handleScroll = this.handleScroll.bind(this);
	}

	render() {
		const {fixed, visible, toggle} = this.props.nav;
		const col = {fixed, toggle};
		return (
			<nav className={`${s.root} ${fixed? s.fixed : ''} ${visible ? s.visible : ''}`}>
				<div className="container-fluid">
					<div className={s.header}>
						<ToggleButton click={this.props.toggle}/>
						<IndexLink to="/" className={s.brand}>{this.props.brand}</IndexLink>
					</div>
					<CollapseBar context={col} button={{state: toggle, handler: this.props.toggle}}/>
				</div>
			</nav>
		);
	}

	componentDidMount() {
		if (window.innerWidth > 1170) {
			addEventListener(window, 'scroll', this._handleScroll);
		}
	}

	componentWillUnmount() {
		if (window.innerWidth > 1170) {
			removeEventListener(window, 'scroll', this._handleScroll);
		}
	}

	handleScroll(e) {
		let currentTop = window.scrollY;
		const $header = document.querySelector('header');
		const pre = this.state.pre;
		const nav = this.props.nav;
		const {visible, fix} = this.props;

		if (currentTop < pre) {
			if (currentTop > 0 && nav.fixed) {
				if (!nav.visible) {
					visible(true);
				}
			} else {
				if (nav.fixed) {
					fix(false);
				}
				if (nav.visible) {
					visible(false);
				}
			}
		} else {
			if (nav.visible) {
				visible(false);
			}
			if (currentTop > $header.clientHeight && !nav.fixed) {
				if (!nav.fixed) {
					fix(true);
				}
			}
		}
		this.setState({
			pre: currentTop,
		});
	}
}

function mapState(state) {
	return {
		nav: state.nav,
		brand,
	};
}

export default connect(mapState, {toggle, fix, visible}, null, {pure: true})(withStyles(Nav, s));
