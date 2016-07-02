import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TagList.scss';
import removeSpace from '../../core/removeSpace'

class TagList extends Component {

	static propTypes = {
		tagName: PropTypes.string.isRequired,
		list: PropTypes.array.isRequired,
	};

	render() {
		const {list, tagName} = this.props;
		return (
			<div className={s.root}>
				<span className={`fa fa-tag ${s.seperator}`} id={removeSpace(tagName)}>
					<span className={s.text}>  {tagName}</span>
				</span>
				{list.map((value, index) => {
					return (
						<div className={s.preview} key={index}>
							<Link to={value.path}>
								<h2 className={s.title}>{value.title}</h2>
								<h3 className={s.sub}>{value.subtitle}</h3>
							</Link>
							<hr/>
						</div>
					);
				})}
			</div>
		);
	}
}

export default withStyles(TagList, s);
