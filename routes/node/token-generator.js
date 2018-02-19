'use strict';
var crypto = require('crypto');

var Token =(function(){
    function Token(secret){
        //contructor
        this.secret = secret;
    }

    Token.prototype.get = function(){
        var hash = crypto.createHmac('sha256', this.secret)
                        .update(process.env.APP_SECRET_TOKEN_KEY+Date())
                        .digest('hex');
        return hash;
    }
    return Token;
}());
module.exports = Token;
