import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TagCloud.scss';

const {floor} = Math;

class TagCloud extends Component {

	static propTypes = {
		tags: PropTypes.object.isRequired,
	};

	render() {
		const tags = this.props.tags;
		return (
			<div className={s.root}>
				{Object.keys(tags).map((value, index) => {
					const num = tags[value].length, obj = {};
					if (num >= 8) {
						obj.backgroundColor = 'rgb(0,133,161)';
					} else {
						obj.backgroundColor = `rgb(${floor(214 - 26.7 * num)},${floor(198 - 7.4 * num)},${floor(249 - num * 11)})`;
					}
					return <a
						rel={index}
						className={s.tag}
						href={`#${value}`}
						key={index}
						title={value}
						style={obj}
					>{value}</a>
				})}
			</div>
		);
	}
}

export default withStyles(TagCloud, s);
