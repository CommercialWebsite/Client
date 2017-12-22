module.exports = function(app, models){

    var msgError="";
	var msgValidation = "";
	var rp = require('request-promise');
	var request = require('request');
	var api = models.myApiCat;



	// =====================================
	// adminCat ==============================
	// =====================================
	// show the adminCat form
	app.get('/adminCat', function(req, res, next) {
    console.log(api);
		msgError="";
		msgValidation="";
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			rp("https://"+api.host+"/categories/" ).then(function(body){
				res.render('adminCat.ejs', {msgError:"", msgValidation : msgValidation, listCat :  JSON.parse(body), session : req.session});
			});
		}

	});

	app.get('/adminCat/valide', function(req, res, next) {
		msgError="";
		msgValidation="Categorie ajoutée !";
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			setTimeout(function(){ rp("https://"+api.host+"/categories/" ).then(function(body){
				res.render('adminCat.ejs', {msgError:"", msgValidation : msgValidation, listCat :  JSON.parse(body), session : req.session});
			})},500);
		}

	});


	// process the addcat form
	app.post('/adminCat', function (req, res, next) {
		msgError="";
		msgValidation="";

		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			 res.redirect("/");
		 }else{
				msgError="";
			if (!req.body.name){
				msgError = "Veuillez saisir un nom !"
				res.redirect('/adminCat');
			}else{

				rp({
					url:"https://"+api.host+"/categories/"+req.body.name,
					method : "GET"

				}).then(function(body){
					if(body){
						msgError="Cette catégorie existe déjà !";
					}
				}).catch(function (err) {
						//console.log("Error rp1 : " + err)
				}).then(function(){
					if (msgError==""){
						rp({
							url: "https://"+api.host+"/categories/" ,
							method: "POST",
							headers:{
								'Content-Type': 'application/json'
							},
							json:{
							  "name":req.body.name
								}
						}).then(function(body){
							//console.log("Body 1 : " + body)
						}).catch(function (err) {
							msgError="Erreur veuillez lors de la création. Veuillez recommmencer !";

						});


					}

				}).then(function(){
					if(msgError==""){
						msgValidation = "Catégorie ajoutée !"
						res.redirect("/adminCat/valide");
					}else{
						rp("https://"+api.host+"/categories/" ).then(function(body){
							res.render('adminCat.ejs', {msgError:msgError, msgValidation : msgValidation, listCat :  JSON.parse(body), session : req.session});
						});
					}

				});


			}
		}
	});


	app.post('/adminCat/update', function (req, res, next) {
		msgError="";
		msgValidation="";

		 if(!req.session.type || (req.session.type && req.session.type!="admin")){
			 res.redirect("/");
		 }else{
			if (!req.body.name){
				msgError = "Veuillez saisir un nom !"
			}else{
				rp({
					url:"https://"+api.host+"/categories/"+req.body.name,
					method : "GET"
				}).then(function(body){
					if(JSON.parse(body) && req.body.nameOld != req.body.name ){
						msgError="Ce nom de catégorie est déjà utilisée ! ";
					}
				}).catch(function (err) {
					//console.log("Error rp1 : " + err)
				}).then(function(){
					if(msgError==""){
						rp({
							url: "https://"+api.host+"/categories/" ,
							method: "PUT",
							headers:{
								'Content-Type': 'application/json'
							},
							json:{
							  "id" : req.body.id,
							  "name": req.body.name
							}
						}).then(function(body){
							//console.log("Body 2 : " + body)
						}).catch(function (err) {
							msgError = "Erreur lors de la de la catégorie ! Merci de réessayer. !"
							rp("https://"+api.host+"/categories/" ).then(function(body){
								res.render('adminCatUpdate.ejs', {msgError:msgError, msgValidation : msgValidation, listCat : JSON.parse(body), session : req.session});
							});

						});

					}

				}).then(function(body){
					if(msgError==""){
						msgValidation = "Catégorie ajoutée !"
						res.redirect("/adminCat/update/valide");
					}else{
						rp("https://"+api.host+"/categories/" ).then(function(body){
							res.redirect('/adminCat/update/error/'+req.body.id);
						});
					}
				});

			}
		 }
	});

	app.get('/adminCat/update/valide', function(req, res, next) {
		msgError="";
		msgValidation="";
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			setTimeout(function(){ rp("https://"+api.host+"/categories/" ).then(function(body){
				res.render('adminCat.ejs', {msgError:"", msgValidation : "Modification enregistrée !", listCat :  JSON.parse(body), session : req.session});
			});}, 500);
		}

	});

	app.get('/adminCat/update/:tagId', function(req, res, next) {
		msgError="";
		msgValidation="";
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			rp("https://"+api.host+"/categories/category/"+req.params.tagId ).then(function(body){
				res.render('adminCatUpdate.ejs', {msgError:"", msgValidation : msgValidation, listCat :  JSON.parse(body), session : req.session});
			});
		}

	});

	app.get('/adminCat/update/error/:tagId', function(req, res, next) {
		msgError="";
		msgValidation="";
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			rp("https://"+api.host+"/categories/category/"+req.params.tagId ).then(function(body){
				res.render('adminCatUpdate.ejs', {msgError:"Ce nom de catégorie est déjà utilisé !", msgValidation : msgValidation, listCat :  JSON.parse(body), session : req.session});
			});
		}

	});

	app.get('/adminCat/delete/:tagId', function(req, res, next) {
		msgError="";
		msgValidation=""
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			rp({
				url: "https://"+api.host+"/categories/" ,
				method: "DELETE",
				body: [req.params.tagId]
			}).then(function(body){
				res.redirect("/adminCat/delete/")
			}).catch(function (err) {
				msgError = "Erreur lors du Delete ! Merci de réessayer. !"
				console.log("err : " +err)
				rp("https://"+api.host+"/categories/" ).then(function(body){
					res.render('adminCat.ejs', {msgError:msgError, msgValidation : msgValidation, listCat :  JSON.parse(body), session : req.session});
				});

			});
		}

	});

	app.get('/adminCat/delete/', function(req, res, next) {
		msgError="";
		msgValidation=""
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			rp("https://"+api.host+"/categories/" ).then(function(body){
				res.render('adminCat.ejs', {msgError:"", msgValidation : "Catégorie supprimée !", listCat :  JSON.parse(body), session : req.session});
			});
		}

	});


};
