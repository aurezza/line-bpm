function localechecker(locale){  
    var translations = require('../locale/'+locale+'/receiver');    
    var localetext = {
        text:translations.text,
        label:translations.label
    };
    return translations;
}

module.exports = localechecker;
