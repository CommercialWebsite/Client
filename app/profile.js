module.exports = function(app, models){

    var msgError="";
	var msgValidation = "";
	var rp = require('request-promise');
	var request = require('request');
	var api = models.myApiUser; 
	var bcrypt = require('bcrypt-nodejs');


	// =====================================
	// profile ==============================
	// =====================================
	// show the profile form
	app.get('/profile', function(req, res, next) {
		msgError="";
		msgValidation="";
    console.log(api);
		if(!req.session.type){
			res.redirect("/");
		}else{
			rp("https://"+api.host+"/user/"+req.session.login ).then(function(body){
				res.render('profile.ejs', {msgError:"", msgValidation : msgValidation, user :  JSON.parse(body), session : req.session});
			});
		}

	});

	app.get('/profile/valide', function(req, res, next) {
		msgError="";
		msgValidation="Compte mise a jour !";
		if(!req.session.type){
			res.redirect("/");
		}else{
			setTimeout(function(){ rp("https://"+api.host+"/user/"+req.session.login ).then(function(body){
				res.render('profile.ejs', {msgError:"", msgValidation : msgValidation, user :  JSON.parse(body), session : req.session});
			})},1000);
		}

	});


	// process the signup form
	app.post('/profile', function (req, res, next) {
		msgError="";
		msgValidation="";

		if(!req.session.type){
			res.redirect("/");
		}else{
			if(!req.body.lastName){
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
					url: "https://"+api.host+"/user/" ,
					method: "PUT",
					headers:{
						'Content-Type': 'application/json'
					},
					json:{
					  "id" : req.body.id,
					  "lastName": req.body.lastName,
					  "name":req.body.name,
					  "login": req.session.login,
					  "email": req.body.mail,
					  "addresse" : req.body.adresse,
					  "cp" : req.body.cp,
					  "ville" : req.body.ville,
					  "type": req.session.type
					}
				}).then(function(body){
					if(msgError==""){
						msgValidation = "Compte modifié !"
						res.redirect("/profile/valide");
					}else{
						res.redirect('/profile/error');
					}
				}).catch(function (err) {
					msgError = "Erreur lors de la modification du compte ! Merci de réessayer. !"
					rp("https://"+api.host+"/user/"+req.session.login ).then(function(body){
						res.render('profile.ejs', {msgError:msgError, msgValidation : msgValidation, user :  JSON.parse(body), session : req.session});
					});

				});

			}



		}
	});


	app.get('/profile/error', function(req, res, next) {
		msgError="";
		msgValidation="";
		if(!req.session.type){
			res.redirect("/");
		}else{
			rp("https://"+api.host+"/user/"+req.session.login ).then(function(body){
				res.render('profile.ejs', {msgError: "Erreur lors de la modification du compte ! Merci de réessayer. !", msgValidation : msgValidation, user :  JSON.parse(body), session : req.session});
			});
		}

	});



	app.post('/profile/updatePwd', function(req, res, next) {
		msgError="";
		msgValidation=""
		if(!req.session.type){
			res.redirect("/");
		}else{
			if(req.body.pwd1 == req.body.pwd2){
				rp({
					url:"https://"+api.host+"/auth/",
					method : "POST",
					body : [req.session.login]
				}).then(function(body){
					if(body){
						if (bcrypt.compareSync(req.body.oldPwd, JSON.parse(body).pwd)){
							rp({
								url: "https://"+api.host+"/auth/" ,
								method: "PUT",
								headers:{
									'Content-Type': 'application/json'
								},
								json:{
								  "id" : JSON.parse(body).id,
								  "login": JSON.parse(body).login,
								  "pwd": bcrypt.hashSync(req.body.pwd1,null,null)
								}
							}).then(function(body){
								res.redirect('profile/valide')
							})
						}else{
							rp("https://"+api.host+"/user/"+req.session.login ).then(function(body){
								res.render('profile.ejs', {msgError: "Ancien mot de passe non correcte !", msgValidation : msgValidation, user :  JSON.parse(body), session : req.session});
							});
						}
					}
				})
			}else{
				rp("https://"+api.host+"/user/"+req.session.login ).then(function(body){
					res.render('profile.ejs', {msgError: "mot de passe non identique !", msgValidation : msgValidation, user :  JSON.parse(body), session : req.session});
				});
			}
		}

	});



};
