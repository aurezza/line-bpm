function Japanese(key,userName){
    var japanese = {
        text: "こんにちは！\n"+"追加ありがとう BPMS-Messaging Bot \n" + 
        "続行するにはログインしてください " + key,
        userExist:"お帰りなさい "+userName + "!\n良い一日を :D "
    };
    return japanese;
}


module.exports = Japanese;