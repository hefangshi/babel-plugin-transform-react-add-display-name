import {Component} from 'react';

class Foo extends Component {
    render() {
        return (
        <div onClick={this.handleClick}></div>
        );
    }
}