// *
// Bad try to package the bootstrap-grid, maybe canceled latter
// --------------------------------------------------------------------------------

import React, {PropTypes} from 'react';

class Row extends React.Component {

	static propTypes = {
		children: PropTypes.element.isRequired,
	};

	render() {

		return (
			<div className="container">
				<div className="row">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default Row;
