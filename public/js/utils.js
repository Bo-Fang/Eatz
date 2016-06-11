window.utils = {

    // var pubsub = _.extend({},Backbone.Events);
	
    // Asynchronously load templates located in separate .html files
    loadTemplate: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (window[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    window[view].prototype.template = _.template(data);
                }));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    },

    //uploads image to url /dishes/image
    uploadFile: function (file, callbackSuccess) {
        var self = this;
        var data = new FormData();
        data.append('file', file);
        $.ajax({
            url: '/dishes/image',
            type: 'POST',
            data: data,
            processData: false,
            cache: false,
            contentType: false
        })
        .done(function () {
            console.log(file.name + " uploaded successfully");
            callbackSuccess();
        })
        .fail(function () {
            self.showNotice('Error!', 'An error occurred while uploading ' + file.name, 'alert-error');
        });
    },

    //displays validation error
    displayValidationErrors: function (messages) {
        for (var key in messages) {
            if (messages.hasOwnProperty(key)) {
                this.addValidationError(key, messages[key]);
            }
        }
        this.showNotice('Warning!', 'Fix validation errors and try again', 'alert-warning');
    },

    //add validation error to a model field
    addValidationError: function (field, message) {
        var controlGroup = $('#' + field).parent().parent();
        controlGroup.addClass('error');
        $('.help-inline', controlGroup).html(message);
    },

    //removes validation error
    removeValidationError: function (field) {
        var controlGroup = $('#' + field).parent().parent();
        controlGroup.removeClass('error');
        $('.help-inline', controlGroup).html('');
    },

    //display notification message
    showNotice: function(title, text, klass) {
        $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
        $('.alert').addClass(klass);
        $('.alert').html('<strong>' + title + '</strong> ' + text);
        $('.alert').show();
    },
 
    //hides notification message
    hideNotice: function() {
        $('.alert').hide();
    }
};
