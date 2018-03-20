function Translation() {
    if (!(this instanceof Translation)) return new Translation();
}

Translation.prototype = {
    translation,
};

function translation(filename) {
    if (typeof filename !== 'string') {
        return 'false';
    }

    if (filename != undefined) {
        return require('../locale/' + process.env.APP_LANGUAGE + '/' + filename); 
    };
}

module.exports = Translation;