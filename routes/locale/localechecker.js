function localechecker(locale){  
    var japanese = require('../locale/'+locale+'/receiver');    
    var localetext = {text:japanese.text,label:japanese.label};
    return localetext;
}

module.exports = localechecker;
