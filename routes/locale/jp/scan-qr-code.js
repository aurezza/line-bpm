function Japanese(key,userName){
    var japanese = {
        text: "こんにちは！\n"+"追加ありがとう BPMS-Messaging Bot \n" + 
        "続行するにはログインしてください " + key,
        userExist:"Welcome Back "+userName
    };
    return japanese;
}


module.exports = Japanese;