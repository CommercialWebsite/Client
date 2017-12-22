module.exports = function(app, models){

	var listCat;
	var rp = require('request-promise');
	var api = models.myApiCat;
	var apiOrder= models.myApiOrder;
	// =====================================
	// adminOrder ==============================
	// =====================================
	app.get('/adminOrder', function(req, res, next) {

		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			rp("https://"+api.host+"/categories/" ).then(function(body){
				listCat = JSON.parse(body);
			}).then(setTimeout(function(){rp("https://"+apiOrder.host+"/orders/" ).then(function(body){
				res.render('adminOrder.ejs', {listOrder :  JSON.parse(body), listCat : listCat, session : req.session});
			})},500)
			);
		}
	});
}
