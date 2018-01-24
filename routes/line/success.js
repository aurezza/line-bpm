function success(router) {
    router.get('/success', function(req, res) {
        res.render('success', {
            title: 'Success!', 
            desc: 'You are now registered'
        });
   });
}

module.exports = success;