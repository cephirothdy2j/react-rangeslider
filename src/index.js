import React, { PropTypes, Component } from 'react';
import { findDOMNode } from 'react-dom';
import cx from 'classnames';

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.substr(1);
}

function maxmin(pos, min, max) {
	if (pos < min) { return min; }
	if (pos > max) { return max; }
	return pos;
}

const constants = {
	orientation: {
		horizontal: {
			dimension: 'width',
			direction: 'left',
			coordinate: 'x',
		},
		vertical: {
			dimension: 'height',
			direction: 'top',
			coordinate: 'y',
		}
	}
};

class Slider extends Component {
	static propTypes = {
		min: PropTypes.number,
		max: PropTypes.number,
		step: PropTypes.number,
		value: PropTypes.number,
		orientation: PropTypes.string,
		onChange: PropTypes.func,
		className: PropTypes.string,
		wrapperStyle: PropTypes.object,
		fillStyle: PropTypes.object,
		handleStyle: PropTypes.object,
		valueStyle: PropTypes.object
	}

	static defaultProps = {
		min: 0,
		max: 100,
		step: 1,
		value: 0,
		orientation: 'horizontal',
		disabled:false
	}

	state = {
		limit: 0,
		grab: 0,
	}

  // Add window resize event listener here
  componentDidMount() {
		window.addEventListener('resize', this.handleUpdate);
		this.handleUpdate();
  }

  handleUpdate = () => {
  	let { orientation } = this.props;
  	let dimension = capitalize(constants.orientation[orientation].dimension);
  	const sliderPos = findDOMNode(this.refs.slider)['offset' + dimension];
  	const handlePos = findDOMNode(this.refs.handle)['offset' + dimension]
  	this.setState({
  		limit: sliderPos - handlePos,
  		grab: handlePos / 2,
  	});
  }

  handleStart = () => {
  	document.addEventListener('mousemove', this.handleDrag);
  	document.addEventListener('mouseup', this.handleEnd);
  }

  handleDrag = (e) => {
  	this.handleNoop(e);
  	let value, { onChange, disabled } = this.props;
  	if (!onChange || disabled) return;

  	value = this.position(e);
  	onChange && onChange(value);
  }

  handleEnd = () => {
  	document.removeEventListener('mousemove', this.handleDrag);
  	document.removeEventListener('mouseup', this.handleEnd);
  }

  handleNoop = (e) => {
  	e.stopPropagation();
  	e.preventDefault();
  }

  getPositionFromValue = (value) => {
  	let percentage, pos;
  	let { limit } = this.state;
  	let { min, max } = this.props;
  	percentage = (value - min) / (max - min);
  	pos = Math.round(percentage * limit);

  	return pos;
  }

  getValueFromPosition = (pos) => {
  	let percentage, value;
  	let { limit } = this.state;
  	let { orientation, min, max, step } = this.props;
  	percentage = (maxmin(pos, 0, limit) / (limit || 1));

  	if (orientation === 'horizontal') {
  		value = step * Math.round(percentage * (max - min) / step) + min;
  	} else {
  		value = max - (step * Math.round(percentage * (max - min) / step) + min);
  	}

  	return value;
  }

  position = (e) => {
  	let pos, value, { grab } = this.state;
  	let { orientation } = this.props;
  	const node = findDOMNode(this.refs.slider);
  	const coordinateStyle = constants.orientation[orientation].coordinate;
  	const directionStyle = constants.orientation[orientation].direction;
  	const coordinate = !e.touches
			? e['client' + capitalize(coordinateStyle)]
			: e.touches[0]['client' + capitalize(coordinateStyle)];
  	const direction = node.getBoundingClientRect()[directionStyle];

  	pos = coordinate - direction - grab;
  	value = this.getValueFromPosition(pos);

  	return value;
  }

  coordinates = (pos) => {
  	let value, fillPos, handlePos;
  	let { limit, grab } = this.state;
  	let { orientation } = this.props;

  	value = this.getValueFromPosition(pos);
  	handlePos = this.getPositionFromValue(value);

  	if (orientation === 'horizontal') {
  		fillPos = handlePos + grab;
  	} else {
  		fillPos = limit - handlePos + grab;
  	}

  	return {
  		fill: fillPos,
  		handle: handlePos,
  	};
  }

  render() {
  	let dimension, direction, position, coords;
  	let { value, orientation, className, wrapperStyle, fillStyle, handleStyle, valueStyle, disabled } = this.props;

  	dimension = constants.orientation[orientation].dimension;
  	direction = constants.orientation[orientation].direction;

  	position = this.getPositionFromValue(value);
  	coords = this.coordinates(position);

		let mergedWrapperStyle = Object.assign({}, wrapperStyle, {pointerEvents: disabled ? 'none' : 'auto'});
		let mergedFillStyle = Object.assign({}, {[dimension]: `${coords.fill}px`}, fillStyle);
		let mergedHandleStyle = Object.assign({}, {[direction]: `${coords.handle}px`}, handleStyle);

  	return (
  		<div
	  		ref="slider"
				style={mergedWrapperStyle}
				className={cx('rangeslider ', 'rangeslider-' + orientation, className)}
	  		onMouseDown={this.handleDrag}
	  		onClick={this.handleNoop}>
	  		<div
		  		ref="fill"
		  		className="rangeslider__fill"
		  		style={mergedFillStyle} />
	  		<div
		  		ref="handle"
		  		className="rangeslider__handle"
					onMouseDown={this.handleStart}
					onTouchMove={this.handleDrag}
					onClick={this.handleNoop}
		  		style={mergedHandleStyle}>
					<div
						className="rangeslider__value"
						style={valueStyle}>
						{value}
					</div>
				</div>
  		</div>
		);
  }
}

export default Slider;
