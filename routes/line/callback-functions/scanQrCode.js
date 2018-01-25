function scanQrCode(client,line_userId)
{
    var translation = localechecker('jp',this.toString());
    console.log("this",this)
    const message = {
        type: 'text',
        text: translation.text+line_userId,
        };
    client.pushMessage(line_userId, message)
        .then(() => {
            console.log("message sent to "+ line_userId);    
        })
        .catch((err) => {
            console.log(err)
        });         
  
}

module.exports = scanQrCode;