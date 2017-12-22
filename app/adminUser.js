module.exports = function(app, models){

    var msgError="";
	var msgValidation = "";
	var rp = require('request-promise');
	var request = require('request');
	var api = models.myApiUser;
  var apiAuth=models.myApiAuth;
	var bcrypt = require('bcrypt-nodejs');

	// =====================================
	// adminUser ==============================
	// =====================================
	// show the adminUser form
	app.get('/adminUser', function(req, res, next) {
		msgError="";
		msgValidation="";
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			rp("https://"+api.host+"/user/" ).then(function(body){
				res.render('adminUser.ejs', {msgError:"", msgValidation : msgValidation, listUser :  JSON.parse(body), session : req.session});
			});
		}

	});

	app.get('/adminUser/valide', function(req, res, next) {
		msgError="";
		msgValidation="Utilisateur ajouté !";
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			setTimeout(function(){ rp("https://"+api.host+"/user/" ).then(function(body){
				res.render('adminUser.ejs', {msgError:"", msgValidation : msgValidation, listUser :  JSON.parse(body), session : req.session});
			})},500);
		}
	});


	// process the signup form
	app.post('/adminUser', function (req, res, next) {
		msgError="";
		msgValidation="";

		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			msgError="";
			if (!req.body.username){
				msgError = "Veuillez saisir un login !"
				res.redirect('/adminUser');

			}else if (!req.body.password){
				msgError = "Veuillez saisir un mot de passe !"
				res.redirect('/adminUser');
			}else if(!req.body.passwordConfirm){
				msgError = "Veuillez retaper votre mot de passe"
				res.redirect('/adminUser');
			}else if(req.body.password!=req.body.passwordConfirm){
				msgError = "Les mots de passe saisient ne sont pas identiques !"
				res.redirect('/adminUser');
			}else if(!req.body.lastName){
				msgError = "Veuillez saisir votre nom ! "
				res.redirect('/adminUser');
			}else if(!req.body.name){
				 msgError = "Veuillez saisir votre prénom ! "
				 res.redirect('/adminUser');
			}else if(!req.body.mail){
				 msgError = "Veuillez saisir votre mail ! "
				res.redirect('/adminUser');
			}else if(!req.body.adresse){
				msgError = "Veuillez saisir votre adresse ! "
				res.redirect('/adminUser');
			}else if(!req.body.cp){
				msgError = "Veuillez saisir votre CP ! "
				res.redirect('/adminUser');
			}else if(!req.body.ville){
				msgError = "Veuillez saisir votre ville ! "
				res.redirect('/adminUser');
			}else{

				rp({
					url:"https://"+api.host+"/auth/",
					method : "POST",
					body : [req.body.username]
				}).then(function(body){
					if(body){
						msgError="Cet utilisateur existe déjà !";
					}
				}).catch(function (err) {
						//console.log("Error rp1 : " + err)
				}).then(function(){
					if (msgError==""){
						rp({
							url: "https://"+api.host+"/user/" ,
							method: "POST",
							headers:{
								'Content-Type': 'application/json'
							},
							json:{
							  "lastName": req.body.lastName,
							  "name":req.body.name,
							  "login": req.body.username,
							  "email": req.body.mail,
							  "addresse" : req.body.adresse,
							  "cp" : req.body.cp,
							  "ville" : req.body.ville,
							  "type": req.body.type

								}
						}).then(function(body){
							//console.log("Body 1 : " + body)
						}).catch(function (err) {
							msgError="Erreur veuillez lors de l'inscription. Veuillez recommmencer !";

						});

						rp({
							url: "https://"+api.host+"/auth/add/" ,
							method: "POST",
							headers:{
								'Content-Type': 'application/json'
							},
							json:{
							  "login": req.body.username,
							  "pwd": bcrypt.hashSync(req.body.password, null, null),
							}
						}).then(function(body){
							//console.log("Body 2 : " + body)
						}).catch(function (err) {
							msgError="Erreur veuillez lors de l'inscription. Veuillez recommmencer !";
							rp("https://"+api.host+"/user/" ).then(function(body){
								res.render('adminUser.ejs', {msgError:msgError, msgValidation : msgValidation, listUser :  JSON.parse(body), session : req.session});
							});

						});
					}

				}).then(function(){
					if(msgError==""){
						msgValidation = "Utilisateur ajouté !"
						res.redirect("/adminUser/valide");
					}else{
						rp("https://"+api.host+"/user/" ).then(function(body){
							res.render('adminUser.ejs', {msgError:msgError, msgValidation : msgValidation, listUser :  JSON.parse(body), session : req.session});
						});
					}

				});


			}
		}
	});

	// process the signup form
	app.post('/adminUser/update', function (req, res, next) {
		msgError="";
		msgValidation="";

		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			if (!req.body.username){
				msgError = "Veuillez saisir un login !"

			}else if(!req.body.lastName){
				msgError = "Veuillez saisir votre nom ! "

			}else if(!req.body.name){
				 msgError = "Veuillez saisir votre prénom ! "

			}else if(!req.body.mail){
				 msgError = "Veuillez saisir votre mail ! "
			}else if(!req.body.adresse){
				 msgError = "Veuillez saisir votre adresse ! "
			}else if(!req.body.cp){
				 msgError = "Veuillez saisir votre CP ! "
			}else if(!req.body.ville){
				 msgError = "Veuillez saisir votre ville ! "
			}else{

				rp({
				url:"https://"+api.host+"/auth/",
				method : "POST",
				body : [req.body.username]
				}).then(function(body){
					if(JSON.parse(body).length>0 && req.body.username != req.body.loginOld ){
						msgError="Ce nom de compte est déjà utilisé ! ";
					}
				}).catch(function (err) {
					//console.log("Error rp1 : " + err)
				}).then(function(){
					if(msgError==""){
						rp({
							url: "https://"+api.host+"/user/" ,
							method: "PUT",
							headers:{
								'Content-Type': 'application/json'
							},
							json:{
							  "id" : req.body.id,
							  "lastName": req.body.lastName,
							  "name":req.body.name,
							  "login": req.body.username,
							  "email": req.body.mail,
							  "addresse" : req.body.adresse,
							  "cp" : req.body.cp,
							  "ville" : req.body.ville,
							  "type": req.body.type
							}
						}).then(function(body){
							//console.log("Body 2 : " + body)
						}).catch(function (err) {
							msgError = "Erreur lors de la modification du compte ! Merci de réessayer. !"
							rp("https://"+api.host+"/user/" ).then(function(body){
								res.render('adminUserUpdate.ejs', {msgError:msgError, msgValidation : msgValidation, listUser :  JSON.parse(body), session : req.session});
							});

						});

					}
					if(req.body.username != req.body.loginOld){
						rp({
							url:"https://"+api.host+"/auth/",
							method : "POST",
							body : [req.body.loginOld]
						}).then(function(body){

							rp({
								url: "https://"+api.host+"/auth/" ,
								method: "PUT",
								headers:{
									'Content-Type': 'application/json'
								},
								json:{
								  "id" : JSON.parse(body).id,
								  "login": req.body.username,
								  "pwd": JSON.parse(body).pwd
								}
							}).catch(function (err) {})
						}).catch(function (err) {
							//console.log("Error rp1 : " + err)
						})


					}

				}).then(function(body){
					if(msgError==""){
						msgValidation = "User ajouté !"
						res.redirect("/adminUser/update/valide");
					}else{
						rp("https://"+api.host+"/user/" ).then(function(body){
							res.redirect('/adminUser/update/error/'+req.body.id);
						});
					}
				});

			}
		}
	});

	app.get('/adminUser/update/valide', function(req, res, next) {
		msgError="";
		msgValidation="";
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			setTimeout(function(){ rp("https://"+api.host+"/user/" ).then(function(body){
				res.render('adminUser.ejs', {msgError:"", msgValidation : "Modification enregistrée !", listUser :  JSON.parse(body), session : req.session});
			});}, 500);

		}

	});

	app.get('/adminUser/update/:tagId', function(req, res, next) {
		msgError="";
		msgValidation="";
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			rp("https://"+api.host+"/user/"+req.params.tagId ).then(function(body){
				res.render('adminUserUpdate.ejs', {msgError:"", msgValidation : msgValidation, listUser :  JSON.parse(body), session : req.session});
			});
		}

	});

	app.get('/adminUser/update/error/:tagId', function(req, res, next) {
		msgError="";
		msgValidation="";
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			rp("https://"+api.host+"/user/"+req.params.tagId ).then(function(body){
				res.render('adminUserUpdate.ejs', {msgError:"Ce nom de produit est déjà utilisé pour cette marque et ce type!", msgValidation : msgValidation, listUser :  JSON.parse(body), session : req.session});
			});
		}

	});

	app.get('/adminUser/delete/:tagId/:tagLogin', function(req, res, next) {
		msgError="";
		msgValidation=""
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			rp({
				url: "https://"+api.host+"/user/" ,
				method: "DELETE",
				body: [req.params.tagId]
			}).then(
			rp({
				url: "https://"+api.host+"/auth/" ,
				method: "DELETE",
				body: [req.params.tagLogin]
			})).then(function(body){
				res.redirect("/adminUser/delete/")
			}).catch(function (err) {
				msgError = "Erreur lors du Delete ! Merci de réessayer. !"
				console.log("err : " +err)
				rp("https://"+api.host+"/user/" ).then(function(body){
					res.render('adminUser.ejs', {msgError:msgError, msgValidation : msgValidation, listUser :  JSON.parse(body), session : req.session});
				});

			});
		}

	});

	app.get('/adminUser/delete/', function(req, res, next) {
		msgError="";
		msgValidation=""
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			rp("https://"+api.host+"/user/" ).then(function(body){
				res.render('adminUser.ejs', {msgError:"", msgValidation : "User supprimé !", listUser :  JSON.parse(body), session : req.session});
			});
		}

	});

	app.get('/adminUser/resetPdw/:tagLogin', function(req, res, next) {
		msgError="";
		msgValidation=""
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			rp({
				url:"https://"+api.host+"/auth/",
				method : "POST",
				body : [req.params.tagLogin]
			}).then(function(body){
				if(body){
					rp({
						url: "https://"+api.host+"/auth/" ,
						method: "PUT",
						headers:{
							'Content-Type': 'application/json'
						},
						json:{
						  "id" : JSON.parse(body).id,
						  "login": JSON.parse(body).login,
						  "pwd": bcrypt.hashSync('password',null,null)
						}
					}).then(function(body){
						rp("https://"+api.host+"/user/" ).then(function(body){
							res.render('adminUser.ejs', {msgError:"", msgValidation : "Le mot de passe de "+req.params.tagLogin+" a bien été modifié !", listUser :  JSON.parse(body), session : req.session});
						});
					})
				}
			})
		}

	});



};
