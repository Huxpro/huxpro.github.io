import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Pager.scss'

class Pager extends Component {

	static propTypes = {
		index: PropTypes.bool.isRequired,
		previous: PropTypes.object,
		next: PropTypes.object,
	};

	render() {
		const {index, previous, next} = this.props;
		return (
			<section>
				<hr/>
				<ul className={`${s.root} ${index?'':s.post}`}>
					{(previous.text) && (
						<li className={s.previous}>
							{(index) && (
								<a href="#"
									 onClick={(e) => this.previousHandler(e)}>
									{previous.text}</a>
							)}
							{(!index) && (
								<Link to={previous.to}>
									{previous.text}
									<br/>
									<span className={s.sub}>{previous.sub}</span>
								</Link>
							)}
						</li>
					)}
					{(next.text) && (
						<li className={s.next}>
							{(index) && (
								<a href="#"
									 onClick={(e) => this.nextHandler(e)}>
									{next.text}</a>
							)}
							{(!index) && (
								<Link to={next.to}>
									{next.text}
									<br/>
									<span className={s.sub}>{next.sub}</span>
								</Link>
							)}
						</li>
					)}
				</ul>
			</section>
		)
	}

	previousHandler(e) {
		e.preventDefault();
		this.props.previous.pager();
		window.scroll(0, 0);
	}

	nextHandler(e) {
		e.preventDefault();
		this.props.next.pager();
		window.scroll(0, 0);
	}
}

export default withStyles(Pager, s)
