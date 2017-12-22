module.exports = function(app){
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs', {session : req.session}); // load the index.ejs file
	});
}