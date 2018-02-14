var crypto = require('crypto');

var Token =(function(){
    function Token(secret){
        //contructor
        this.secret = secret;
    }

    Token.prototype.get = function(){
        var hash = crypto.createHmac('sha256', this.secret)
                        .update('TMJP OFFSHORE GANG'+Date())
                        .digest('hex');
        console.log(hash);
    }
    return Token;
}());
module.exports = Token;
