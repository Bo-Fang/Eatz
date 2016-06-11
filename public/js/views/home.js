window.HomeView = Backbone.View.extend({

    // The DOM events specific to an item.

    initialize: function () {
	this.render();
    },

    render: function () {
	this.$el.html(this.template());  // create DOM content for HomeView
	return this;    // support chaining
    }
});
