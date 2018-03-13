function localechecker(locale, filename) {  
    return require('../locale/' + locale + '/' + filename);    
}

module.exports = localechecker;
