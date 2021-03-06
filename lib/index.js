'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

function maxmin(pos, min, max) {
  if (pos < min) {
    return min;
  }
  if (pos > max) {
    return max;
  }
  return pos;
}

var constants = {
  orientation: {
    horizontal: {
      dimension: 'width',
      direction: 'left',
      coordinate: 'x'
    },
    vertical: {
      dimension: 'height',
      direction: 'top',
      coordinate: 'y'
    }
  }
};

var Slider = (function (_Component) {
  _inherits(Slider, _Component);

  function Slider() {
    var _this = this;

    _classCallCheck(this, Slider);

    _get(Object.getPrototypeOf(Slider.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      limit: 0,
      grab: 0
    };

    this.handleUpdate = function () {
      var orientation = _this.props.orientation;

      var dimension = capitalize(constants.orientation[orientation].dimension);
      var sliderPos = (0, _reactDom.findDOMNode)(_this.refs.slider)['offset' + dimension];
      var handlePos = (0, _reactDom.findDOMNode)(_this.refs.handle)['offset' + dimension];
      _this.setState({
        limit: sliderPos - handlePos,
        grab: handlePos / 2
      });
    };

    this.handleStart = function () {
      document.addEventListener('mousemove', _this.handleDrag);
      document.addEventListener('mouseup', _this.handleEnd);
    };

    this.handleDrag = function (e) {
      _this.handleNoop(e);
      var value = undefined;var _props = _this.props;
      var onChange = _props.onChange;
      var disabled = _props.disabled;

      if (!onChange || disabled) return;

      value = _this.position(e);
      onChange && onChange(value);
    };

    this.handleEnd = function () {
      document.removeEventListener('mousemove', _this.handleDrag);
      document.removeEventListener('mouseup', _this.handleEnd);
    };

    this.handleNoop = function (e) {
      e.stopPropagation();
      e.preventDefault();
    };

    this.getPositionFromValue = function (value) {
      var percentage = undefined,
          pos = undefined;
      var limit = _this.state.limit;
      var _props2 = _this.props;
      var min = _props2.min;
      var max = _props2.max;

      percentage = (value - min) / (max - min);
      pos = Math.round(percentage * limit);

      return pos;
    };

    this.getValueFromPosition = function (pos) {
      var percentage = undefined,
          value = undefined;
      var limit = _this.state.limit;
      var _props3 = _this.props;
      var orientation = _props3.orientation;
      var min = _props3.min;
      var max = _props3.max;
      var step = _props3.step;

      percentage = maxmin(pos, 0, limit) / (limit || 1);

      if (orientation === 'horizontal') {
        value = step * Math.round(percentage * (max - min) / step) + min;
      } else {
        value = max - (step * Math.round(percentage * (max - min) / step) + min);
      }

      return value;
    };

    this.position = function (e) {
      var pos = undefined;var value = undefined;var grab = _this.state.grab;
      var orientation = _this.props.orientation;

      var node = (0, _reactDom.findDOMNode)(_this.refs.slider);
      var coordinateStyle = constants.orientation[orientation].coordinate;
      var directionStyle = constants.orientation[orientation].direction;
      var coordinate = !e.touches ? e['client' + capitalize(coordinateStyle)] : e.touches[0]['client' + capitalize(coordinateStyle)];
      var direction = node.getBoundingClientRect()[directionStyle];

      pos = coordinate - direction - grab;
      value = _this.getValueFromPosition(pos);

      return value;
    };

    this.coordinates = function (pos) {
      var value = undefined,
          fillPos = undefined,
          handlePos = undefined;
      var _state = _this.state;
      var limit = _state.limit;
      var grab = _state.grab;
      var orientation = _this.props.orientation;

      value = _this.getValueFromPosition(pos);
      handlePos = _this.getPositionFromValue(value);

      if (orientation === 'horizontal') {
        fillPos = handlePos + grab;
      } else {
        fillPos = limit - handlePos + grab;
      }

      return {
        fill: fillPos,
        handle: handlePos
      };
    };
  }

  _createClass(Slider, [{
    key: 'componentDidMount',

    // Add window resize event listener here
    value: function componentDidMount() {
      window.addEventListener('resize', this.handleUpdate);
      this.handleUpdate();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.handleUpdate);
    }
  }, {
    key: 'render',
    value: function render() {
      var dimension = undefined,
          direction = undefined,
          position = undefined,
          coords = undefined;
      var _props4 = this.props;
      var value = _props4.value;
      var orientation = _props4.orientation;
      var className = _props4.className;
      var wrapperStyle = _props4.wrapperStyle;
      var fillStyle = _props4.fillStyle;
      var handleStyle = _props4.handleStyle;
      var valueStyle = _props4.valueStyle;
      var disabled = _props4.disabled;

      dimension = constants.orientation[orientation].dimension;
      direction = constants.orientation[orientation].direction;

      position = this.getPositionFromValue(value);
      coords = this.coordinates(position);

      var mergedWrapperStyle = Object.assign({}, wrapperStyle, { pointerEvents: disabled ? 'none' : 'auto' });
      var mergedFillStyle = Object.assign({}, _defineProperty({}, dimension, coords.fill + 'px'), fillStyle);
      var mergedHandleStyle = Object.assign({}, _defineProperty({}, direction, coords.handle + 'px'), handleStyle);

      return _react2['default'].createElement(
        'div',
        {
          ref: 'slider',
          style: mergedWrapperStyle,
          className: (0, _classnames2['default'])('rangeslider ', 'rangeslider-' + orientation, className),
          onMouseDown: this.handleDrag,
          onClick: this.handleNoop },
        _react2['default'].createElement('div', {
          ref: 'fill',
          className: 'rangeslider__fill',
          style: mergedFillStyle }),
        _react2['default'].createElement(
          'div',
          {
            ref: 'handle',
            className: 'rangeslider__handle',
            onMouseDown: this.handleStart,
            onTouchMove: this.handleDrag,
            onClick: this.handleNoop,
            style: mergedHandleStyle },
          _react2['default'].createElement(
            'div',
            {
              className: 'rangeslider__value',
              style: valueStyle },
            value
          )
        )
      );
    }
  }], [{
    key: 'propTypes',
    value: {
      min: _react.PropTypes.number,
      max: _react.PropTypes.number,
      step: _react.PropTypes.number,
      value: _react.PropTypes.number,
      orientation: _react.PropTypes.string,
      onChange: _react.PropTypes.func,
      className: _react.PropTypes.string,
      wrapperStyle: _react.PropTypes.object,
      fillStyle: _react.PropTypes.object,
      handleStyle: _react.PropTypes.object,
      valueStyle: _react.PropTypes.object
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      min: 0,
      max: 100,
      step: 1,
      value: 0,
      orientation: 'horizontal',
      disabled: false
    },
    enumerable: true
  }]);

  return Slider;
})(_react.Component);

exports['default'] = Slider;
module.exports = exports['default'];