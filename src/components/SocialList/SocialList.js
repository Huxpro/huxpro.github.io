import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SocialList.scss';

class SocialList extends Component {

	static propTypes = {
		SNS: PropTypes.object.isRequired,
	};

	render() {
		const sl = this.props.SNS;

		return (
			<ul className={s.root}>
				<li><a target="_blank" href={"https://www.zhihu.com/people/" + sl.zhihu}>
					<span className="fa-stack fa-lg">
						<i className="fa fa-circle fa-stack-2x"></i>
						<i className="fa fa-stack-1x fa-inverse">知</i>
					</span>
				</a></li>
				<li><a target="_blank" href={"http://weibo.com/" + sl.weibo}>
					<span className="fa-stack fa-lg">
						<i className="fa fa-circle fa-stack-2x"></i>
						<i className="fa fa-weibo fa-stack-1x fa-inverse"></i>
					</span>
				</a></li>
				<li><a target="_blank" href={"https://www.facebook.com/" + sl.facebook}>
					<span className="fa-stack fa-lg">
						<i className="fa fa-circle fa-stack-2x"></i>
						<i className="fa fa-facebook fa-stack-1x fa-inverse"></i>
					</span>
				</a></li>
				<li><a target="_blank" href={"https://github.com/" + sl.github}>
					<span className="fa-stack fa-lg">
						<i className="fa fa-circle fa-stack-2x"></i>
						<i className="fa fa-github fa-stack-1x fa-inverse"></i>
					</span>
				</a></li>
			</ul>
		);
	}
}

export default withStyles(SocialList, s)
