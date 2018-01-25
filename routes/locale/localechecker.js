function localechecker(locale){  
    var translations = require('../locale/'+locale+'/receiver');    
    return translations;
}

module.exports = localechecker;
