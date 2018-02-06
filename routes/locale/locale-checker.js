function localechecker(locale,filename){  
    return translations = require('../locale/'+locale+'/'+filename);    
}

module.exports = localechecker;
