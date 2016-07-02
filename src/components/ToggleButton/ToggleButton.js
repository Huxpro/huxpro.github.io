import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ToggleButton.scss';

class ToggleButton extends Component {

	render() {
		return (
			<button type="button" className={s.root} onClick={(e) => this.handleClick(e)}>
				<span className="sr-only">Toggle navigation</span>
				<span className={s.iconBar}></span>
				<span className={s.iconBar}></span>
				<span className={s.iconBar}></span>
			</button>
		);
	}

	handleClick(e) {
		e.preventDefault();
		this.props.click();
	}
}

export default withStyles(ToggleButton, s);
