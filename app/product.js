module.exports = function(app, models){

	var listCat;
	var listProducts
    var api = models.myApiProduct;
		  var apiCat = models.myApiCat;
    var rp = require('request-promise');
	var bodyParser = require('body-parser')
	var name;
	var brand;
	var typeId;
	var url;

	app.use(bodyParser.json());

	app.post('/product/filter', function(req, res) {
		name = req.body.name;
		brand = req.body.brand;
		typeId = req.body.typeId;
		url = "https://"+api.host+"/product/find/"+name+"/"+brand+"/"+typeId;
		rp(url).then(function(body){
			listProducts = JSON.parse(body);
		}).then(setTimeout(function(){
			res.end('{"listProducts" : '+JSON.stringify(listProducts)+', "status" : 200}');
		},500));
	});

    app.get('/product', function(req, res) {
		rp("https://"+apiCat.host+"/categories/" ).then(function(body){
				listCat = JSON.parse(body);
			}).then(setTimeout(function(){
        rp("https://"+api.host+"/product/" ).then(function(body) {
            res.render('product.ejs', {session: req.session, listCat : listCat,products: JSON.parse(body)});
        })},500)
    );
	});
}
