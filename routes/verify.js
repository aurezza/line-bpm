function verify(router) {
    // use passport authentication module 
    // http://www.passportjs.org/
    router.get('/verify', function(req, res) {
        res.render('verify', {
            title: 'Verification for BPMS App'
        });
   });
}

module.exports = verify;