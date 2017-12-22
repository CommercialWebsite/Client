module.exports = function(app, models){

    var msgError="";
	var rp = require('request-promise')
	var request = require('request');
	
	
	var api = models.myApi; 
 
	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	
	app.get('/logout', function(req, res, next) {
		req.session.destroy();
		res.redirect("/");
	});


};