
module.exports = function(app, models){
	
	require("./index")(app);
	require("./login")(app, models);
	require("./signup")(app, models);
	require("./adminProduct")(app, models);
	require("./adminOrder")(app, models);
	require("./adminUser")(app, models);
	require("./adminCat")(app, models);
	require("./profile")(app, models);
	require("./logout")(app, models);
	require("./product")(app, models);
    require("./cart")(app, models);
    require("./order")(app, models);
}

