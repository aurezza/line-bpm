function localechecker(){  
    var japanese = require('../locale/jp/receiver');    
    var localetext = {text:japanese.text,label:japanese.label};
    return localetext;
}

module.exports = localechecker;
