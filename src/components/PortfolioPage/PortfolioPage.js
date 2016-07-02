import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './PortfolioPage.scss'

import Header from '../Header'

import {headers, portfolio, SEOTitle} from '../../constants'

class PortfolioPage extends Component {

	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired,
	};

	componentWillMount() {
		this.context.onSetTitle(this.props.title);
	}

	render() {
		const {list, icon, header} = this.props;
		return (
			<div>
				<Header style={header}/>
				<div className={s.root}>
					<ul className={s.timeline}>
						{list.map((value, index) => {
							return (
								<li key={index}>
									<div className={s.label}>
										<h2>
											{value.title}
										</h2>
										<time>{value.time}</time>
										<img src={`./img/portfolio/${value.img}`} alt={value.title}/>
										<ul>
											<li dangerouslySetInnerHTML={{ __html: value.content || '' }}/>
											<li className={s.skill}>
												{value.skills.map((value, index) => {
													return (
														<span key={index}>
														<img src={require(`./${icon[value]}`)}/>
													</span>
													)
												})}
											<span className={s.link}>
												<a href={value.link}
													 target="_blank">{value.try ? value.try : 'Try it'}</a>
											</span>
											</li>
										</ul>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		);
	}
}

function mapState() {
	return {
		icon: portfolio.icon,
		list: portfolio.list,
		header: headers.portfolio,
		title: SEOTitle.portfolio,
	}
}


export default connect(mapState)(withStyles(PortfolioPage, s));

