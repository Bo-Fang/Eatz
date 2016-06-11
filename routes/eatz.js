"use strict";

var mongoose = require('mongoose'), // MongoDB integration
    fs = require('fs'),
    // GraphicsMagick (gm) for Node is used to resize user-supplied images
    gm = require('gm').subClass({imageMagick: true}),
    config = require(__dirname + '/../config'),  // port#, other params
    express = require("express"),
    bcrypt = require("bcrypt");

// Connect to database
mongoose.connect('mongodb://' +config.dbuser+ ':' +config.dbpass+
			'@' +config.dbhost+ '/' + config.dbname, function(err) { if (err) console.log(err); });

// Schemas
var Dish = new mongoose.Schema({
    name: { type: String, required: true },  
    venue: { type: String, required: true },  
    info: { type: String, required: false  },  
    number: { type: String, required: true },  
    street: { type: String, required: true }, 
    city: { type: String, required: true },  
    province: { type: String, required: true },  
    url: { type: String, required: true },  
    picture: { type: String, required: false },
    lat: { type: Number, required: false },
    lon: { type: Number, required: false }
});

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true }
});


// Models
var User = mongoose.model('User', UserSchema);
var DishModel = mongoose.model('DishModel', Dish);

// each name:venue pair are unique; duplicates are dropped
Dish.index({'name' : 1, 'venue' : 1}, { unique: true, dropDups: true });

//DishModel.ensureIndexes({'name' : 1, 'venue' : 1}, { unique: true, dropDups: true }); 

//exports
// retrieve an individual dish model, using it's id as a DB key
exports.getDish = function(req, res){
    DishModel.findById(req.params.id, function(err, dish) {
        if (err) {
            res.send(500, "Sorry, unable to retrieve dish at this time ("
                +err.message+ ")" );
        } else if (!dish) {
            res.send(404, "Sorry, that dish doesn't exist; try reselecting from browse view");
        } else {
            res.send(200, dish);
        }
    });
};

// retrieve a collection of dish models
exports.getDishes = function(req, res) {
    DishModel.find({}, function(err, dishes){
        if (err){
            res.send(500, "Sorry, unable to retrieve dishes at this time ("
                +err.message+ ")" );
	 } else if (!dishes) {
            res.send(404, "Sorry, dishes doesn't exist");
        } else {
            res.send(200, dishes);
        }
    });
};

//creating a new DishModel then adding it into the DB
exports.addDish = function(req, res) {
    var dish = new DishModel({
	     name : req.body.name,
	     venue : req.body.venue,
	     info : req.body.info,
	     number : req.body.number,
	     street : req.body.street,
	     city : req.body.city,
	     province : req.body.province,
	     url : req.body.url,
            image : req.body.image
	});
	console.log(dish.id);
    dish.save(function(err, dish){
        if (!err) {
            res.send(dish);
        } else {
            res.send(500, "Sorry, unable to add dish at this time ("
                +err.message+ ")" );
        }
    });
};

// retrieve an individual dish model, using it's id as a DB key, then updating the attributes
exports.editDish = function(req, res) {
    DishModel.findById(req.params.id, function(err, dish){
        if(!err){
            dish.name = req.body.name;
	     dish.venue = req.body.venue;
	     dish.info = req.body.info;
	     dish.number = req.body.number;
	     dish.street = req.body.street;
	     dish.city = req.body.city;
	     dish.province = req.body.province;
	     dish.url = req.body.url;
            dish.image = req.body.image;
            dish.save(function(err, dish) {
                if (!err) {
                    res.send(dish); // return model
		
                } else {
                    res.send(500, "Sorry, unable to update dish at this time ("+err.message+ ")" );
                }
            });
        } else {
            res.send(500, "Sorry, unable to find this dish("+err.message+ ")" );
        }
    });
};

// retrieve an individual dish model, using it's id as a DB key, then removing it from the DB
exports.deleteDish = function(req, res) {
    DishModel.findById(req.params.id, function(err, dish) {
        if (!err) {
            dish.remove(function(err, dish) {
                if (err) {
                    res.send(500, "Sorry can't delete dish ("+err.message+ ")" );
                }else{
        	    res.send(dish);
       	  }
            });
        }else{
            res.send(500, "Sorry cant find dish ("+err.message+ ")" );
        }
    });
};

// signup new username
exports.signup = function(req, res) {
  var user = new User(req.body);  // instantiate model with request attributes
  // generate random salt value for new username
  bcrypt.genSalt(10, function(err, salt) {
    // secure hash of user password with salt value
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;  // hash encodes both hash-result and salt
      // create DB record for new username
      user.save(function (err, result) {
        if (!err) {  // save successful, result contains saved user model
      	  req.session.auth = true;
      	  req.session.username = result.username;
      	  req.session.userid = result.id;
          res.send({'username':result.username, 'userid':result.id});
        } else {  // save failed
	  // could alternatively detect duplicate username using find()
	  if (err.err.indexOf("E11000") != -1) {  // duplicate username error
            res.send(403, "Sorry, username <b>"+user.username+"</b> is already taken");
	  } else {  // any other DB error
            res.send(500, "Unable to create account at this time; please try again later "
			 + err.message);
	  }
	}
      });
    });
  });
};

exports.uploadImage = function (req, res) {
    // req.files is an object, attribute "file" is the HTML-input name attr
    var filePath = req.files.name;
    console.log(filepath);
/*
        tmpFile = ...  // ADD CODE to extract root file name 
    	imageURL = 'img/uploads/' + tmpFile,
        writeStream = __dirname + ...   // ADD CODE
    // process EditView image
    gm(filePath).resize(...).write(... , function(err) {  // ADD CODE
	if (!err) {
    	    // ADD CODE process DishesView image and return image filename to client
	} else
	    // ADD CODE to return error result to client
    });
*/
    // ADD CODE to remove any temp files
};
