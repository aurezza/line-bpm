function Translation() {
    if (!(this instanceof Translation)) return new Translation();
}

Translation.prototype = {
    get,
};

function get(filename) {
    if (typeof filename !== 'string') {
        return 'false';
    }

    if (filename != undefined) {
        return require('../locale/' + process.env.APP_LANGUAGE + '/' + filename); 
    };
}

module.exports = Translation;