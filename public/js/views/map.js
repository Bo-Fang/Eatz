window.MapView = Backbone.View.extend({

    initialize: function () {
	if (this.options.lat) {                           //User's location
		var lat = this.options.lat;
		var lng = this.options.lon;
	}else{ 						 //UTSC coordinates
		var lat = 43.784925;
		var lng = -79.185323;
	};
	this.myLatlng = new google.maps.LatLng(lat, lng); //creating latlng object
       this.mapOptions = { 
          center: this.myLatlng,
          zoom: 16,
	   mapTypeId: google.maps.MapTypeId.ROADMAP
       };
       google.maps.event.addDomListener(window, 'load', this.render);     //event listener for rendering the map
       //google.maps.event.trigger(this.map, 'resize');
    },

    render: function () {
       $(this.el).html(this.template());
       var map = new google.maps.Map($('#map-canvas', this.$el)[0],this.mapOptions);         //creating map object
	var marker = new google.maps.Marker({position: this.myLatlng, title:'You are here!'});  //Marker on current location
	marker.setMap(map);
	google.maps.event.trigger(map,'resize'); 
	//map.setCenter(marker.getPosition());
	return this;
    },

    resize: function () {
	google.maps.event.trigger(this.map, 'resize');
    }
});