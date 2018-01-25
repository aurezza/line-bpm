function localechecker(locale,filename){  
    var translations = require('../locale/'+locale+'/'+filename);    
    return translations;
}

module.exports = localechecker;
