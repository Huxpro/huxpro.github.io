import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Sidebar.scss';
import SidebarTags from '../SidebarTags';
import SidebarAbout from '../SidebarAbout';
import Friends from '../Friends';


class Sidebar extends Component {

	static propTypes = {
		tags: PropTypes.object.isRequired,
		friends: PropTypes.array.isRequired,
		about: PropTypes.object.isRequired,
	};

	render() {
		return (
			<div className={`col-lg-3 col-md-12 ${s.root}`}>
				<SidebarTags tags={this.props.tags}/>
				<SidebarAbout about={this.props.about}/>
				<Friends friends={this.props.friends}/>
			</div>
		)
	}
}

export default withStyles(Sidebar, s);
