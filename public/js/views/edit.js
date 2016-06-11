window.EditView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
	 $('#map', this.el).append(new MapView({lat: this.lat, lon: this.lon}).render().el);
        return this;
    },

    events: {
        "change"        : "change",
        "click .save"   : "beforeSave",
        "click .delete" : "deleteDish",
        "drop #picture" : "dropHandler",
	"dragover #picture" : "dragHandler",
	'dragenter #picture' : 'alertMe',
	'click .location' : 'getLocation'
    },

    //takes a LatLng object and sets the location property to query the Geocoder service
    UserAddress: function (latLng) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          "location": latLng
        }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK)
            alert(results[0].formatted_address);
      });
      },

    //handler for user location
    getLocation: function () {
	var self = this;
	if (navigator.geolocation) {
 	 	var timeoutVal = 10 * 1000 * 1000;
 	 	navigator.geolocation.getCurrentPosition(                //requests user location
		self.getPosition, 						 //function to handle successfully retrieving location 
 	        self.displayError,						 //function to handle error 
  	  	{ enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
 		);
	} else {
 		 alert("Geolocation is not supported by this browser");
       }
    },

    //Handles user coordinates
    getPosition: function (position) {
	var self = this;
	this.lat = position.coords.latitude;
	this.lon = position.coords.longitude;
  	alert("Latitude: " + this.lat + ", Longitude: " + this.lon);
	self.render();

    },

    //Displays error from getcurrentlocation
    displayError: function (error) {
  	var errors = { 
   	  1: 'Permission denied',
  	  2: 'Position unavailable',
  	  3: 'Request timeout'
      };
  	alert("Error: " + errors[error.code]);
    },

    alertMe: function(event){
        console.log('drag enter event called');
    },

    //Applies change to model
    change: function (event) {
        // Remove any existing alert message
        utils.hideNotice();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = _.escape(target.value);
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    //validates model, uploads image and saves 
    beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
	if (this.pictureFile) {
            this.model.set("picture", this.pictureFile.name);
	    console.log(this.pictureFile.name);
            utils.uploadFile(this.pictureFile,
                function () {
                    self.saveDish();
                }
            );
        } else {
       	  this.saveDish();
	}
        return false;
    },
   
    //saves dish model
    saveDish: function () {
        var self = this;
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('dishes/' + model.id, false);
                utils.showNotice('Success!', 'Dish saved successfully', 'alert-success');
            },
            error: function () {
                utils.showNotice('Error', 'Dish cannot be saved!', 'alert-error');
            }
        });
    },

    //removes dish model
    deleteDish: function () {
        this.model.destroy({
            success: function () {
                utils.showNotice('Success!','Dish deleted successfully','alert-success');
                window.history.back();
            }
        });
        return false;
    },

    //handler for drag event
    dragHandler: function(event){
        event.preventDefault();
        event.stopPropagation();
    },

    //handler for drop event and displays it in img tag
    dropHandler: function(event){
        event.preventDefault();
        event.stopPropagation();
        event.originalEvent.dataTransfer.dropEffect = 'copy';
        this.pictureFile = event.originalEvent.dataTransfer.files[0];

	// Read the image file from the local file system and display it in the img tag
        var reader = new FileReader();
        reader.onloadend = function () {
            $('#picture').attr('src', reader.result);
        };
        reader.readAsDataURL(this.pictureFile);
    }
});
