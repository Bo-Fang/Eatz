var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "dishes"            : "list",
        "dishes/page/:page" : "list",
        "dishes/add"        : "addDish",
        "dishes/:id"        : "edit",
        "about"             : "about"
    },

//renders headerview
    initialize: function () {
	pubSub = _.extend({}, Backbone.Events);
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

//renders homeview
    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

//renders dishesview based on page#
    list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var dishList = new DishCollection();
        dishList.fetch({success: function(){
            $("#content").html(new DishesView({model: dishList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

//Takes model id and renders editview
    edit: function (id) {
        var dish = new Dish({_id: id});
        dish.fetch({success: function(){
            $("#content").html(new EditView({model: dish}).el);
        }});
        this.headerView.selectMenuItem();
    },

//creates new dish model and renders editvew
    addDish: function() {
        var dish = new Dish();
        $('#content').html(new EditView({model: dish}).el);
        this.headerView.selectMenuItem('add-menu');
	},

//renders aboutview
    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HeaderView', 'DishView', 'EditView', 'AboutView', 'HomeView', 'MapView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});
