function success(router) {
    router.get('/success', function(req, res) {
        res.render('success', {
            title: 'Success!', 
            description: 'You are now registered'
        });
   });
}

module.exports = success;