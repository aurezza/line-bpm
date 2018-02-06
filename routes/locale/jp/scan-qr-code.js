function Japanese(params){
    var japanese = {
        text: "こんにちは！\n"+"追加ありがとう BPMS-Messaging Bot \n" + 
        "続行するにはログインしてください " + params.url,
        userExist:"お帰りなさい "+params.userName + "!\n良い一日を :D "
    };
    return japanese;
}


module.exports = Japanese;