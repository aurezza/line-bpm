

function Translation() {
    if (!(this instanceof Translation)) return new Translation();
}

Translation.prototype = {
    translation,
};

function translation(locale, filename) {
    if ((typeof locale !== 'string')) {
        return 'false';
    }

    if (typeof filename !== 'string') {
        return 'false';
    }

    if (locale != undefined && filename != undefined) {
        return require('../locale/' + locale + '/' + filename); 
    };
}

module.exports = Translation;