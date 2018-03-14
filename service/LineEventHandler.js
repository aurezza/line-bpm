'use strict';

function LineEventHandler() {
    if (!(this instanceof LineEventHandler)) return new LineEventHandler();
}

LineEventHandler.prototype = {
    eventHandler: {
        follow: follow
    }
};

function follow(params) {
    console.log("follow")
}

function unfollow(params) {
    console.log('unfollow')
}

module.exports = LineEventHandler;
