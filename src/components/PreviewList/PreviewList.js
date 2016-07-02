import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PreviewList.scss';

import PostPreview from '../PostPreview';
import Pager from '../Pager'

class PreviewList extends Component {

	static propTypes = {
		list: PropTypes.array.isRequired,
		pageNum: PropTypes.number.isRequired,
		max: PropTypes.number.isRequired,
		pager: PropTypes.object,
	};

	render() {
		const {list, pageNum, pager, max} = this.props;


		const previews = [];
		for (let i = 0; i < 10; i++) {
			previews.push(list[pageNum * 10 + i]);
		}

		const previous = pageNum === 0 ? {} : {
			text: '← Newer Posts',
			pager: pager.decrease,
		};

		const next = pageNum === max ? {} : {
			text: 'Older Posts →',
			pager: pager.increase,
		};

		return (
			<div className={`col-lg-8 col-md-12 ${s.postList}`}>
				{previews.map(function (item, index) {
					return <PostPreview context={item} key={pageNum * 10 + index}/>
				})}

				<Pager index={true} previous={previous} next={next}/>

			</div>
		);
	}

	previousPage(e) {
		e.preventDefault();
		this.setState({
			paginate: this.state.paginate - 1
		});
		window.scroll(0, 0);
	}

	nextPage(e) {
		e.preventDefault();
		this.setState({
			paginate: this.state.paginate + 1
		});
		window.scroll(0, 0);
	}
}

export default withStyles(PreviewList, s);
