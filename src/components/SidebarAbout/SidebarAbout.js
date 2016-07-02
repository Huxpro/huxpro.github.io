import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SidebarAbout.scss';
import SocialList from '../SocialList';

class SidebarAbout extends Component {

	static propTypes = {
		about: PropTypes.object.isRequired,
	};

	render() {
		const ab = this.props.about;
		return (
			<section className={s.root}>
				<hr />
				<h5><a href="/about">ABOUT ME</a></h5>
				<div className={s.about}>
					<img src={ab.avatar} alt="short about"/>
					<p>{ab.description}</p>
					<SocialList SNS={ab.SNS}/>
				</div>
			</section>
		);
	}
}

export default withStyles(SidebarAbout, s);
