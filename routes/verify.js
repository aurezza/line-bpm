function verify(router, lineID) {
    // use passport authentication module 
    // http://www.passportjs.org/
    router.get('/verify/:line_id', function(req, res) {
        var lineID = req.params.line_id;
        res.render('verify', {
            title: 'Verification for BPMS App',
            lineID: lineID
        });
   });

}

module.exports = verify;