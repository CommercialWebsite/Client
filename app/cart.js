module.exports = function(app, models){

    var api = models.myApi;
    var rp = require('request-promise');


    app.post('/cart/add', function(req, res) {


        if (typeof req.session.products === 'undefined') {
            req.session.products = [];
        }

        req.session.products.push(req.body);

        res.end('{"success" : "Ajouté au panier", "status" : 200}');


    });

    app.get('/cart', function(req, res) {
        res.render('cart.ejs', { session: req.session });
    });


}