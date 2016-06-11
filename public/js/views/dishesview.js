window.DishesView = Backbone.View.extend({
    
    initialize: function () {
	//this.listenTo(this.pubsub, 'ordering', this.sort);
        this.render();
    },

    render: function () {
        var dishes = this.model.models;
        var len = dishes.length;
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);
        $(this.el).html('<ul class="thumbnails"></ul>');

        for (var i = startPos; i < endPos; i++) {
            $('.thumbnails', this.el).append(new DishView({model: dishes[i]}).render().el);
        }

        $(this.el).append(new Pages({model: this.model, page: this.options.page}).render().el);

        return this;
    }
});

window.Pages = Backbone.View.extend({

    className: "pagination pagination-centered",

    initialize:function () {
        this.model.bind("reset", this.render, this);
        this.render();
    },

    render:function () {

        var items = this.model.models;
        var len = items.length;
        var pageCount = Math.ceil(len / 8);

        $(this.el).html('<ul />');

        for (var i=0; i < pageCount; i++) {
            $('ul', this.el).append("<li" + ((i + 1) === this.options.page ? " class='active'" : "") + "><a href='#dishes/page/"+(i+1)+"'>" + (i+1) + "</a></li>");
        }

        return this;
    }
});
