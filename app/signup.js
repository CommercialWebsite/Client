module.exports = function(app, models){

    var msgError="";
	var rp = require('request-promise')
	var request = require('request');
	var bcrypt = require('bcrypt-nodejs');

	var api = models.myApiUser;
 var apiauth=models.myApiAuth;
	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form

	app.get('/signup', function(req, res, next) {
		msgError="";
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', {msgError:"", session : req.session});
	});

	// process the signup form
	app.post('/signup', function (req, res, next) {
		msgError="";
        if (!req.body.username){
            msgError = "Veuillez saisir un login !"
			res.render('signup.ejs', {msgError:msgError,session : req.session});

        }else if (!req.body.password){
            msgError = "Veuillez saisir un mot de passe !"
			res.render('signup.ejs', {msgError:msgError, session : req.session});

        }else if(!req.body.passwordConfirm){
            msgError = "Veuillez retaper votre mot de passe"
			res.render('signup.ejs', {msgError:msgError, session : req.session});

        }else if(req.body.password!=req.body.passwordConfirm){
            msgError = "Les mots de passe saisient ne sont pas identiques !"
			res.render('signup.ejs', {msgError:msgError, session : req.session});

        }else if(!req.body.lastName || req.body.lastName.length<3){
            msgError = "Veuillez saisir un nom de plus de 3 caractères! "
			res.render('signup.ejs', {msgError:msgError, session : req.session});

        }else if(!req.body.name || req.body.name.length<3){
             msgError = "Veuillez saisir un prénom de plus de 3 caractères!! "
			 res.render('signup.ejs', {msgError:msgError, session : req.session});
        }else if(!req.body.mail){
             msgError = "Veuillez saisir votre mail ! "
			 res.render('signup.ejs', {msgError:msgError, session : req.session});

        }else if(!req.body.adresse){
             msgError = "Veuillez saisir votre adresse ! "
			 res.render('signup.ejs', {msgError:msgError, session : req.session});

        }else if(!req.body.cp){
             msgError = "Veuillez saisir votre CP ! "
			 res.render('signup.ejs', {msgError:msgError, session : req.session});

        }else if(!req.body.ville){
             msgError = "Veuillez saisir votre ville ! "
			 res.render('signup.ejs', {msgError:msgError, session : req.session});

        }else{

			rp({
				url:"https://"+apiauth.host+"/auth/",
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
						  "type": "admin"

							}
					}).then(function(body){
						//console.log("Body 1 : " + body)
					}).catch(function (err) {
						console.log(err);
						msgError="Erreur veuillez lors de l'inscription. Veuillez recommmencer !";

					});

					rp({
						url: "https://"+apiauth.host+"/auth/add/" ,
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
            console.log(err);
						res.render('signup.ejs', {msgError:"Erreur veuillez lors de l'inscription. Veuillez recommmencer !", session : req.session});

					});
				}

			}).then(function(){
				if(msgError==""){
					res.render('signup.ejs', {msgError:"Inscription validé !", session : req.session});
				}else{
					res.render('signup.ejs', {msgError:msgError, session : req.session});
				}


			});


        }
	});





};
