module.exports = function(app, models){

    var gid = require('guid');
	var idImage=gid.create();
    var msgError="";
	var msgValidation = "";
	var listCat;
	var rp = require('request-promise');
	var request = require('request');
	var api = models.myApiProduct;
  var apiCat=models.myApiCat;
    var multer = require("multer");
	var myFile = "";
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './app/image/');
        },
        filename: function (req, file, callback) {
        	var extention=file.originalname.split(".");
			idImage=gid.create();
            callback(null, file.fieldname + '-' + idImage+'.'+extention[extention.length-1]);
        }
    });

	// =====================================
	// adminProduct ==============================
	// =====================================
	// show the adminProduct form
	app.get('/adminProduct', function(req, res, next) {
		msgError="";
		msgValidation="";
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
      console.log(apiCat);
			rp("https://"+apiCat.host+"/categories/" ).then(function(body){
				listCat = JSON.parse(body);
			}).then(setTimeout(function(){rp("https://"+api.host+"/product/" ).then(function(body){
				res.render('adminProduct.ejs', {msgError:"", msgValidation : msgValidation, listProduct :  JSON.parse(body), listCat : listCat, session : req.session});
			})},500)
			);
		}
	});

	app.get('/adminProduct/valide', function(req, res, next) {
		msgError="";
		msgValidation="Produit ajouté !";
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			rp("https://"+apiCat.host+"/categories/" ).then(function(body){
				listCat = JSON.parse(body);
			}).then(setTimeout(function(){rp("https://"+api.host+"/product/" ).then(function(body){
				res.render('adminProduct.ejs', {msgError:"", msgValidation : msgValidation, listProduct :  JSON.parse(body), listCat : listCat, session : req.session});
			})},500)
			);
		}

	});


	// process the adminProduct form
	app.post('/adminProduct', multer({storage: storage}).single('imageURL'),function (req, res, next) {
		msgError="";
		msgValidation="";
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			if (!req.body.name){
				msgError = "Veuillez saisir un nom !"
				 res.redirect('/adminProduct');
			}else if (!req.body.brand){
				msgError = "Veuillez saisir une marque !"
				 res.redirect('/adminProduct');
			}else if(!req.body.typeId){
				msgError = "Veuillez choisir un type !"
				 res.redirect('/adminProduct');
			}else if(!req.body.price){
				msgError = "Veuillez saisir un prix ! "
				res.redirect('/adminProduct');
			}else{
				rp("https://"+api.host+"/product/find/"+req.body.name+"/"+req.body.brand+"/"+req.body.typeId).then(function(body){
					if(JSON.parse(body).length>0){
						msgError="Ce nom de produit est déjà utilisé pour cette marque et ce type! ";
					}
				}).catch(function (err) {
					//console.log("Error rp1 : " + err)
				}).then(function(){
					if(msgError==""){
						rp({
							url: "https://"+api.host+"/product/" ,
							method: "POST",
							headers:{
								'Content-Type': 'application/json'
							},
							json:{
							  "name": req.body.name,
							  "brand": req.body.brand,
							  "typeId": req.body.typeId,
							  "price": req.body.price,
							  "imageURL": req.file.filename
							}
						}).then(function(body){
							//console.log("Body 2 : " + body)
						}).catch(function (err) {
							msgError = "Erreur lors de la création du produit ! Merci de réessayer. !"
							rp("https://"+apiCat.host+"/categories/" ).then(function(body){
								listCat = JSON.parse(body);
							}).then(setTimeout(function(){rp("https://"+api.host+"/product/" ).then(function(body){
								res.render('adminProduct.ejs', {msgError:msgError, msgValidation : msgValidation, listProduct :  JSON.parse(body), listCat : listCat, session : req.session});
							})},500)
							);

						});

					}

				}).then(function(body){
					if(msgError==""){
						msgValidation = "Produit ajouté !"
						res.redirect("/adminProduct/valide");
						/*rp("https://"+api.host+"/product/" ).then(function(body){
							res.render('adminProduct.ejs', {msgError:"", msgValidation : msgValidation, listProduct :  JSON.parse(body), session : req.session});
						});*/
					}else{
						rp("https://"+apiCat.host+"/categories/" ).then(function(body){
							listCat = JSON.parse(body);
						}).then(setTimeout(function(){rp("https://"+api.host+"/product/" ).then(function(body){
							res.render('adminProduct.ejs', {msgError:msgError, msgValidation : msgValidation, listProduct :  JSON.parse(body), listCat : listCat, session : req.session});
						})},500)
						);
					}
				});
			}
		}
	});

	// process the signup form
	app.post('/adminProduct/update',multer({storage: storage}).single('imageURL'), function (req, res, next) {
		msgError="";
		msgValidation="";
		myFile="";
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			if (!req.body.name){
				msgError = "Veuillez saisir un nom !"
				 res.redirect('/adminProduct');
			}else if (!req.body.brand){
				msgError = "Veuillez saisir une marque !"
				 res.redirect('/adminProduct');
			}else if(!req.body.typeId){
				msgError = "Veuillez choisir un type !"
				 res.redirect('/adminProduct');
			}else if(!req.body.price){
				msgError = "Veuillez saisir un prix ! "
				res.redirect('/adminProduct');
			}else{
				if(req.body.name == req.body.nameOld && req.body.brand == req.body.brandOld && req.body.type == req.body.typeOld && req.body.price == req.body.priceOld && req.body.imageURL == req.body.imageURLOld ){
					res.redirect("adminProduct/update/valide")
				}else{
					rp("https://"+api.host+"/product/find/"+req.body.name+"/"+req.body.brand+"/"+req.body.typeId).then(function(body){

						if(JSON.parse(body).length>0 && (req.body.name != req.body.nameOld || req.body.brand != req.body.brandOld || req.body.type != req.body.typeOld)){
							msgError="Ce nom de produit est déjà utilisé pour cette marque et ce type! ";
						}


					}).catch(function (err) {
						//console.log("Error rp1 : " + err)
					}).then(function(){
						if(req.file){
							myFile = req.file.filename;
							console.log("req.file.filename : " + req.file.filename)
						}else{
							myFile = req.body.imageURLOld;
							console.log("req.body.imageURLOld : " + req.body.imageURLOld)
						}
						if(msgError==""){

							rp({
								url: "https://"+api.host+"/product/" ,
								method: "PUT",
								headers:{
									'Content-Type': 'application/json'
								},
								json:{
								  "id" : req.body.id,
								  "name": req.body.name,
								  "brand": req.body.brand,
								  "typeId": req.body.typeId,
								  "price": req.body.price,
								  "imageURL": myFile
								}
							}).then(function(body){
								//console.log("Body 2 : " + body)
							}).catch(function (err) {
								msgError = "Erreur lors de la création du produit ! Merci de réessayer. !"

								rp("https://"+apiCat.host+"/categories/" ).then(function(body){
									listCat = JSON.parse(body);
								}).then(setTimeout(function(){rp("https://"+api.host+"/product/" ).then(function(body){
									res.render('adminProduct.ejs', {msgError:msgError, msgValidation : msgValidation, listProduct :  JSON.parse(body), listCat : listCat, session : req.session});
								})},500)
								);

							});

						}

					}).then(function(body){
						if(msgError==""){
							msgValidation = "Produit ajouté !"
							res.redirect("/adminProduct/update/valide");
						}else{
							res.redirect('/adminProduct/update/error/'+req.body.id);
						}
					});
				}

			}
		}
	});

	app.get('/adminProduct/update/valide', function(req, res, next) {
		msgError="";
		msgValidation="";
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			rp("https://"+apiCat.host+"/categories/" ).then(function(body){
				listCat = JSON.parse(body);
			}).then(setTimeout(function(){rp("https://"+api.host+"/product/" ).then(function(body){
				res.render('adminProduct.ejs', {msgError:"", msgValidation : "Modification enregistrée !", listProduct :  JSON.parse(body), listCat : listCat, session : req.session});
			})},500)
			);
		}

	});

	app.get('/adminProduct/update/:tagId', function(req, res, next) {
		msgError="";
		msgValidation="";
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			rp("https://"+apiCat.host+"/categories/" ).then(function(body){
				listCat = JSON.parse(body);
			}).then(setTimeout(function(){rp("https://"+api.host+"/product/"+req.params.tagId  ).then(function(body){
				res.render('adminProductUpdate.ejs', {msgError:"", msgValidation : msgValidation, listProduct :  JSON.parse(body), listCat : listCat, session : req.session});
			})},500)
			);

		}

	});

	app.get('/adminProduct/update/error/:tagId', function(req, res, next) {
		msgError="";
		msgValidation="";
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			rp("https://"+apiCat.host+"/categories/" ).then(function(body){
				listCat = JSON.parse(body);
			}).then(setTimeout(function(){rp("https://"+api.host+"/product/"+req.params.tagId  ).then(function(body){
				res.render('adminProductUpdate.ejs', {msgError:"Ce nom de produit est déjà utilisé pour cette marque et ce type!", msgValidation : msgValidation, listProduct :  JSON.parse(body), listCat : listCat, session : req.session});
			})},500)
			);
		}

	});

	app.get('/adminProduct/delete/:tagId', function(req, res, next) {
		msgError="";
		msgValidation=""
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			rp({
				url: "https://"+api.host+"/product/" ,
				method: "DELETE",

				body: [req.params.tagId]
			}).then(function(body){
				res.redirect("/adminProduct/delete/")
			}).catch(function (err) {
				msgError = "Erreur lors du Delete ! Merci de réessayer. !"
				console.log("err : " +err)

				rp("https://"+apiCat.host+"/categories/" ).then(function(body){
					listCat = JSON.parse(body);
				}).then(setTimeout(function(){rp("https://"+api.host+"/product/" ).then(function(body){
					res.render('adminProduct.ejs', {msgError:msgError, msgValidation : msgValidation, listProduct :  JSON.parse(body), listCat : listCat, session : req.session});
				})},500)
				);

			});
		}

	});

	app.get('/adminProduct/delete/', function(req, res, next) {
		msgError="";
		msgValidation=""
		if(!req.session.type || (req.session.type && req.session.type!="admin")){
			res.redirect("/");
		}else{
			rp("https://"+apiCat.host+"/categories/" ).then(function(body){
				listCat = JSON.parse(body);
			}).then(setTimeout(function(){rp("https://"+api.host+"/product/" ).then(function(body){
				res.render('adminProduct.ejs', {msgError:msgError, msgValidation : "Produit supprimé !", listProduct :  JSON.parse(body), listCat : listCat, session : req.session});
			})},500)
			);
		}
	});

};
