window.Dish = Backbone.Model.extend({

     urlRoot: "/dishes",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.venue = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a venue"};
        };

        this.validators.city = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a city"};
        };

        this.validators.street = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a street"};
        };

        this.validators.number = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a number"};
        };

        this.validators.province = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a province"};
        };

        this.validators.url = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a url"};
        };
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        id: null,
        name: "",
        venue: "",
        street: "",
        city: "",
        province: "",
        number: "",
        info: "",
	 url: "",
        picture: null
    }
});

