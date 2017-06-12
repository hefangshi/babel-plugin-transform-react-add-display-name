import React, {Component} from 'react';

const Foo = class extends Component {
    render() {
        return (
        <div onClick={this.handleClick}></div>
        );
    }
}