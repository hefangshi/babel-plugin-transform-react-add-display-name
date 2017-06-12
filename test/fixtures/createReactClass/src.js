import React, {createReactClass} from 'react';

let Foo = createReactClass({
    foo: 'bar',
    render() {
        return (
        <div onClick={this.handleClick}></div>
        );
    }
});