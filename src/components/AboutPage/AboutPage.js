import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './AboutPage.scss'

import Row from '../../core/Row'
import Header from '../Header'
import Sidebar from '../Sidebar'

import {headers, tags, friends, about, SEOTitle} from '../../constants'

import {
	changeAboutLang as change
} from '../../actions'

class AboutPage extends Component {

	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired,
	};

	componentWillMount() {
		this.context.onSetTitle(this.props.static.title);
	}

	componentDidMount() {
		if (this.props.lang === 'C') {
			document.getElementById('zh').style.display = 'block';
		} else {
			document.getElementById('en').style.display = 'block';
		}
	}

	render() {
		const {lang} = this.props;
		const {tags, about, friends, header} = this.props.static;
		return (
			<div>
				<Header style={header}/>
				<Row>
					<div>
						<div className="col-lg-8 col-md-12 offset-lg-1">
							<select defaultValue={lang} onChange={(e) => this.handleChange(e)}>
								<option value="C">中文 Chinese</option>
								<option value="E">英文 English</option>
							</select>
							<div className={s.root} dangerouslySetInnerHTML={{ __html: this.props.content || '' }}>
							</div>
						</div>
						<Sidebar tags={tags} about={about} friends={friends}/>
					</div>
				</Row>
			</div>
		);
	}

	handleChange(e) {
		let v = e.target.value;
		this.props.change(v);
		document.getElementById('zh').style.display = 'none';
		document.getElementById('en').style.display = 'none';
		if (v === 'C') {
			document.getElementById('zh').style.display = 'block';
		} else {
			document.getElementById('en').style.display = 'block';
		}
	}
}

function mapState(state) {
	return {
		static: {
			header: headers.about,
			tags,
			about,
			friends,
			title: SEOTitle.about,
		},
		lang: state.about.lang,
	}
}


export default connect(mapState, {change}, null, {pure: true})(withStyles(AboutPage, s));
