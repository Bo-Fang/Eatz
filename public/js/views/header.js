window.HeaderView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    },

    events: {
        "click .sort"   : "radioClick",
 	"change"        : "change",
        "click .signup" : "signup"

    },

    selectMenuItem: function (menuItem) {
        $('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    },

    radioClick : function () {
	alert("You clicked me");
	//this.pubsub.trigger("ordering", this.$(".sort").val()));
	},

    change: function (event) {
        self = this;
        utils.hideNotice();   // Remove any existing alert message

	if (!this.model)
	    this.model = new User();  // create model to hold auth credentials

        var change = {};  // object to hold input changes

        // note change event is triggered once for each changed field value
        change[event.target.name] = event.target.value;

        // reflect changes in the model
        this.model.set(change);

        // run validation rule (if any) on changed item
        var check = this.model.validateItem(event.target.name);

        check.isValid ?
              utils.removeValidationError(event.target.id)
            : utils.addValidationError(event.target.id, check.message);
     },

    // process signup form when user clicks "Sign Up" button
     signup: function(e) {
        e.preventDefault();

	$('#signupdrop').removeClass('open');  // close signup dropdown menu
	// collect form input strings 
	var formdata = {'username': this.$('#signup_username').val(),
                        'email': this.$('#email').val(),
                        'password': this.$('#signup_password').val()};

	// create User model instance with input data
	var user = new User(formdata);
	console.log(user);
	// click-event target
	var target = e.target;

	// initiate Ajax request to check user-credentials and create DB entry for user
        $.ajax({
            url: '/auth',
            type: 'POST',  // HTTP POST method
            contentType: 'application/json',  // HTTP request-header
            dataType: 'json',
            data: JSON.stringify(formdata),  // map object to JSON format
            success: function(res) {  // callback for success response
		if (res.error) 
                    utils.showNotice('Signup Failed', 'Failed to create account', 'alert-error');
		else {
                    utils.showNotice('Signup Successful!', 'Welcome ' + res.username, 'alert-success');
		    // update UI to show username, show/hide logout form
		    $('#greet').html(res.username);
		    $('#logoutUser').html('<b>'+res.username+'</b>');
		    $('.btn.login').css("display","none");
		    $('.logintext').css("display","none");
		    $('.btn.logout').css("display","block");
		    $('#login_form')[0].reset();   // clear login form
	            $('#signupdrop').removeClass('open');
		}
            },
            error: function (e) {  // server request returned non-200 type response
		// rely on server to return meaningful error-message text
                utils.showNotice('Error', e.responseText, 'alert-error');
            }
	 });
       }
});
