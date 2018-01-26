function success(router) {
    router.get('/success', function(req, res) {
        res.render('success', {
            title: 'Success!', 
            description: 'Your account has been verified!'
        });
   });
}

module.exports = success;