import React from 'react';

let Foo = React.createClass({
    foo: 'bar',
    render() {
        return (
        <div onClick={this.handleClick}></div>
        );
    }
});