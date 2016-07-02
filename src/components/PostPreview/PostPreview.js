import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PostPreview.scss';
import moment from 'moment';

class PostPreview extends Component {
	static propTypes = {
		context: PropTypes.shape({
			title: PropTypes.string.isRequired,
			summary: PropTypes.string.isRequired,
			path: PropTypes.string.isRequired,
			subtitle: PropTypes.string,
			author: PropTypes.string,
			date: PropTypes.any,
		}),
	};

	render() {
		const ctx = this.props.context;
		const date = new Date(ctx.date);
		const d = moment(date).format('MMMM DD YYYY');

		return (
			<div className={s.root}>
				<Link to={ctx.path}>
					<h2 className={s.title}>{ctx.title}</h2>
					<h3 className={s.subtitle}>{ctx.subtitle}</h3>
					<div className={s.preview}>{ctx.summary + '...'}</div>
				</Link>
				<p className={s.meta}>Posted By {ctx.author} on {d}</p>
			</div>
		);
	}
}

export default withStyles(PostPreview, s);
