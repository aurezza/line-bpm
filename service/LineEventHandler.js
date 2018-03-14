'use strict';

function LineEventHandler() {
    if (!(this instanceof LineEventHandler)) return new LineEventHandler();
}

LineEventHandler.prototype = {
    eventHandler: {
        follow: follow,
        unfollow: unfollow
    }
};

function follow(params) {
    let line_userId = params.req.events[0].source.userId;

    console.log("line_userId", line_userId);
    console.log("follow")
}

function unfollow(params) {
    console.log('unfollow')
}

module.exports = LineEventHandler;
