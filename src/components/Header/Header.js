import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Header.scss'
import moment from 'moment'
import removeSpace from '../../core/removeSpace'


class Header extends Component {

	static propTypes = {
		style: PropTypes.shape({
			title: PropTypes.string.isRequired,
			subtitle: PropTypes.string.isRequired,
			image: PropTypes.string,
			subtitle2: PropTypes.string,
			type: PropTypes.string.isRequired,
			tags: PropTypes.array,
			author: PropTypes.string,
			date: PropTypes.string,
		})
	};


	render() {
		const {style} = this.props;
		const t = style.type;
		return (
			<header className={`${s.root} ${t==='portfolio'?s.portfolio:''}`}
							style={t!=='portfolio'?{ backgroundImage: `url(${style.image})`}:{}}>
				{(style.headerMask) && (
					<div className={s.headerMask} style={{backgroundColor: `rgba(0,0,0,${style.headerMask})`}}></div>)}
				<div className="container">
					<div className="row">
						<div className="col-lg-10 col-xl-8 offset-lg-1 offset-xl-2">
							<div className={`${s.head} ${t==='tags'?s.tags:''} ${t === 'post'? s.post: ''}`}>
								{(t === 'portfolio') && (
									<img src={style.portrait} alt="portrait" width="190" height="190"/>)}
								{(t === 'post') && (
									<div className={s.postTags}>
										{style.tags.map((value, index) => (
											<Link
												key={index}
												to={{pathname: '/tags', hash: removeSpace('#'+value)}}>
												{value}</Link>
										))}
									</div>
								)}
								<h1>{style.title}</h1>
								<span className={s.sub}>{style.subtitle}</span>
								{(t === 'portfolio') && (<span className={s.sub}>{style.subtitle2}</span>)}
								{(t === 'post') && (
									<span className={s.meta}>
										Posted By {style.author}
										on {moment(new Date(style.date)).format('MMMM DD YYYY')}
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</header>
		);
	}
}

export default withStyles(Header, s);
