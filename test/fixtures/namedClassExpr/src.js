import React, {Component} from 'react';

const Foo = class Bar extends Component {
    render() {
        return (
        <div onClick={this.handleClick}></div>
        );
    }
}