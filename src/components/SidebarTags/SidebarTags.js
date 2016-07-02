import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SidebarTags.scss';
import {Link} from 'react-router'
import removeSpace from '../../core/removeSpace'

class SidebarTags extends Component {

	static propTypes = {
		tags: PropTypes.object.isRequired,
	};

	render() {
		const source = [];
		for (let key in this.props.tags) {
			if (this.props.tags[key].length > 1) {
				source.push(key);
			}
		}
		return (
			<section>
				<hr className={s.hr}/>
				<h5><Link to="/tags">FEATURED TAGS</Link></h5>
				<div className={s.root}>
					{source.map((value, index) =>
						<Link to={{pathname: '/tags', hash: removeSpace('#'+value)}} key={index}>{value}</Link>
					)}
				</div>
			</section>
		);
	}
}

export default withStyles(SidebarTags, s);
