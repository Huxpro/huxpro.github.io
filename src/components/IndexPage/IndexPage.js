import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {
	indexNumIncrease as increase,
	indexNumDecrease as decrease,
} from '../../actions'

import Row from '../../core/Row'
import Header from '../Header'
import PreviewList from '../PreviewList'
import Sidebar from '../Sidebar'

import {headers, list, tags, friends, about, SEOTitle} from '../../constants'

class IndexPage extends Component {

	static propTypes = {

	}

	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired,
	};

	componentWillMount() {
		this.context.onSetTitle(this.props.static.title);
	}

	render() {

		const {index, increase, decrease} = this.props;
		const {header, friends, about, list, tags} = this.props.static;
		const pager = {increase, decrease};
		return (
			<div>
				<Header style={header}/>
				<Row>
					<div>
						<PreviewList
							list={list}
							pageNum={index.num}
							max={index.max}
							pager={pager}/>
						<Sidebar tags={tags} about={about} friends={friends}/>
					</div>
				</Row>
			</div>
		);
	}
}

function mapState(state) {
	return {
		static: {
			title: SEOTitle.index,
			header: headers.index,
			list,
			tags,
			friends,
			about,
		},
		index: state.index,
	};
}

export default connect(mapState, {increase, decrease}, null, {pure: true})(IndexPage);


