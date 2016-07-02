import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Footer.scss';
import SocialList from '../SocialList';
import {about} from '../../constants'

class Footer extends Component {

	render() {
		const SNS = about.SNS;
		return (

			<footer className={s.root}>
				<div className="container">
					<div className="row">
						<div className="col-lg-8 col-md-10 offset-lg-2 offset-md-1">
							<SocialList SNS={SNS}/>
							<p className={s.copyright}>
								Copyright © Hux Blog 2016
								<br/>
								Theme by <a href="#">Hux</a>
							</p>
						</div>
					</div>
				</div>
			</footer>
		);
	}

}

export default withStyles(Footer, s);


/*
 | <iframe
 style={{marginLeft: '2px', marginBottom: '-5px'}}
 frameBorder="0"
 scrolling="0"
 width="91px"
 height="20px"
 src="https://ghbtns.com/github-btn.html?user=huxpro&amp;repo=huxpro.github.io&amp;type=star&amp;count=true"
 ></iframe>
 */
