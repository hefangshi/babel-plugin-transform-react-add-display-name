'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Foo = (0, _react.createReactClass)({
    displayName: 'Foo',

    foo: 'bar',
    render: function render() {
        return _react2.default.createElement('div', { onClick: this.handleClick });
    }
});