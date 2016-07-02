import React, {Component, PropTypes} from 'react';
import s from './App.scss';
import Header from '../Header';
import Footer from '../Footer';
import Nav from '../Nav';

class App extends Component {

	static propTypes = {
		children: PropTypes.element.isRequired,
		error: PropTypes.object,
	};

	static contextTypes = {
		insertCss: PropTypes.func.isRequired,
	};

	componentWillMount() {
		const {insertCss} = this.context;
		this.removeCss = insertCss(s);
	}

	componentWillUnmount() {
		this.removeCss();
	}


	render() {
		return !this.props.error ? (
			<div>
				<Nav />
				{this.props.children}
				<Footer />
			</div>
		) : this.props.children;
	}
}


export default App;
