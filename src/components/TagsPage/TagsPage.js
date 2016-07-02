import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Row from '../../core/Row'
import TagCloud from '../TagCloud'
import Header from '../Header'
import TagList from '../TagList'

import {listLite as list, tags, headers, SEOTitle} from '../../constants'

class TagsPage extends Component {

	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired,
	};

	componentWillMount() {
		this.context.onSetTitle(this.props.title);
	}

	componentDidMount() {
		const h = this.props.hash;
		if (h.startsWith('#')) {
			document.querySelector(`${h}`).scrollIntoView();
		}
	}

	render() {
		const {list, tags, header} = this.props;
		return (
			<div>
				<Header style={header}/>
				<Row>
					<div className="col-xl-8 col-lg-10 offset-lg-1 offset-xl-2">
						<TagCloud tags={tags}/>
						{Object.keys(tags).map((value, index) => {
							const l = [];
							tags[value].map((value) => {
								l.push({
									title: list[value].title,
									subtitle: list[value].subtitle,
									path: list[value].path,
								});
							});
							return <TagList list={l} tagName={value} key={index}/>;
						})}
					</div>
				</Row>
			</div>
		);
	}
}

function mapState(state) {
	return {
		tags,
		list,
		header: headers.tags,
		hash: state.routing.locationBeforeTransitions.hash,
		title: SEOTitle.tags,
	}
}

export default connect(mapState)(TagsPage);



