import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ErrorPage.scss';

const title = 'Error';

class ErrorPage extends Component {

	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired,
		onPageNotFound: PropTypes.func.isRequired,
	};

	componentWillMount() {
		this.context.onSetTitle(title);
	}

	render() {
		return (
			<div>
				<h1>{title}</h1>
				<p>Sorry, an critical error occurred on this page.</p>
			</div>
		);
	}

}

export default withStyles(ErrorPage, s);
