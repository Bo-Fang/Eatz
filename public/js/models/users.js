'use strict';

window.Users = Backbone.Collection.extend({
    model: User,

    url:'/auth'  // to interact with the model via the server API
});
