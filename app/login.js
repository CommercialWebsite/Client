module.exports = function(app, models){

	var apiuser = models.myApiUser;
	var apiauth = models.myApiAuth;
    var msgError="";
	var rp = require('request-promise')
	var bcrypt = require('bcrypt-nodejs');
	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		if(req.session.type && req.session.type!=""){
			res.redirect("/");
		}else{
			res.render('login.ejs', { msgError: "", session : req.session });
		}

	});

	// process the login form
	app.post('/login', function (req, res, next) {
		if(req.session.type && req.session.type!=""){
			res.redirect("/");
		}else{
			msgError="";
			if(!req.body.username){
				msgError = "Veuillez saisir votre identifiant ! "
				res.render('login.ejs', {msgError:msgError, session : req.session});
			}else if(!req.body.password){
				msgError = "Veuillez saisir votre mot de passe ! "
				res.render('login.ejs', {msgError:msgError, session : req.session});
			}else{
				rp({
					url: "https://"+apiauth.host+"/auth/" ,
					method: "POST",
					body: [req.body.username]
				}).then(function(body){
					if(body){
						var jsonBody =  JSON.parse(body);

						if(jsonBody.login == req.body.username && bcrypt.compareSync(req.body.password, jsonBody.pwd)){
							rp("https://"+apiuser.host+"/user/"+req.body.username).then(function(body){
							if(body){
								var myJsonObject = JSON.parse(body);
								req.session.cookie.maxAge = 1000 * 60 * 60;
								req.session.login = req.body.username;
								req.session.type = myJsonObject.type;
								res.redirect('/');
							}else{
								msgError = "Erreur combinaion Identifiant/mot de passe ! Merci de réessayer."
							}
						})
						}else{
							msgError = "Erreur combinaion Identifiant/mot de passe ! Merci de réessayer."
						}

					}else{
						msgError = "Erreur combinaion Identifiant/mot de passe ! Merci de réessayer."
					}


				}).catch(function (err) {
					msgError = "Erreur combinaion Identifiant/mot de passe ! Merci de réessayer."
				}).then(function(){

					if(msgError!=""){
						res.render('login.ejs', {msgError:msgError, session : req.session});
					}

				});


			}
		}
    });



}
