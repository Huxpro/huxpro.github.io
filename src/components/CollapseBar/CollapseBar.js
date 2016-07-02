import React, {Component} from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './CollapseBar.scss'
import {IndexLink, Link} from 'react-router'

class CollapseBar extends Component {


	render() {
		const {toggle, fixed} = this.props.context;
		return (
			<div className={toggle ? `${s.wrapper} ${s.in}` : s.wrapper}>
				<div className={`${s.root} ${fixed ? s.fixed : ''}`} ref="bar">
					<ul className={s.bar} onClick={(e) => this.handleClick(e)}>
						<li>
							<IndexLink to="/">Home</IndexLink>
						</li>
						<li>
							<Link to="/about">About</Link>
						</li>
						<li>
							<Link to="/portfolio">Portfolio</Link>
						</li>
						<li>
							<Link to="/tags">Tags</Link>
						</li>
					</ul>
				</div>
			</div>
		);
	}

	componentDidUpdate() {
		var $bar = this.refs.bar;
		if (this.props.context.toggle) {
			$bar.style.height = "auto";
		} else {
			setTimeout(function () {
				$bar.style.height = "0px";
			}, 200);
		}
	}

	handleClick(e) {
		if (this.props.button.state) {
			this.props.button.handler();
		}
	}
}

export default withStyles(CollapseBar, s);
