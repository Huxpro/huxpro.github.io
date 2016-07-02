import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Friends.scss';

class Friends extends Component {

	static propTypes = {
		friends: PropTypes.array.isRequired,
	};

	render() {
		const friends = this.props.friends;

		return (
			<section>
				<hr />
				<h5>FRIENDS</h5>
				<ul className={s.ul}>
					{friends.map((value, index) => <li key={index}><a href={value.href}>{value.title}</a></li>)}
				</ul>
			</section>
		);
	}
}

export default withStyles(Friends, s);
