function responseMessage(messageResponse){
    var response = {
        responded:"こんにちは！あなたはすでにこのリクエストに答えました。ありがとうございます：D",
        cancelled:"このリクエストは既にキャンセルされています。詳細はメール通知を参照してください. "
    };

    return response[messageResponse];
}


module.exports = responseMessage