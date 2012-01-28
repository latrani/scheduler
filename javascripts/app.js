/*global Backbone, Handlebars, _ */

var Event = (function(){
    var Model = Backbone.Model.extend({
        // name: string
        // track: string
    });

    var Collection = Backbone.Collection.extend({
        model: Model
    });

    var SimpleTemplate = Handlebars.compile($("#event-template").html());

    var SimpleView = Backbone.View.extend({  
        render: function() { 
            return $(this.el).html(SimpleTemplate(this.model.attributes));
        }  
    }); 

    return {
        model: Model,
        collection: Collection,
        view: SimpleView
    };
})();

var Room = (function(){
    var Model = Backbone.Model.extend({
        initialize: function() {
            this.events = new Event.collection();
        }
    });

    var Collection = Backbone.Collection.extend({
        model: Model
    });

    var SimpleTemplate = Handlebars.compile($("#room-template").html());

    var SimpleView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, "addEvent");
            this.model.events.bind('add', this.addEvent);

            // This part seems a bit inelegant...
            var that = this;
            $(this.el).on("click", "button.add-event", function(){
                var name = prompt("Name?");
                that.model.events.add(new Event.model({name: name}));
            });
        },
        render: function() { 
            return $(this.el).html(SimpleTemplate(this.model.attributes));
        },
        addEvent: function(event) {
            $(this.el).find(".events").append(new Event.view({model: event}).render());
        }
    }); 

    return {
        model: Model,
        collection: Collection,
        view: SimpleView
    };
})();

var Scheduler = (function(){
    var Model = Backbone.Model.extend({
        initialize: function() {
            this.rooms = new Room.collection();
        }
    });

    var View = Backbone.View.extend({  
        initialize: function() {
            this.el = $("#scheduler");
            this.model.rooms.bind('add', this.addRoom);

            // This part seems a bit inelegant...
            var that = this;
            $(this.el).find(".add-room").click(function(){
                var name = prompt("Name?");
                that.model.rooms.add(new Room.model({name: name}));
            });
        },

        addRoom: function(room) {
          $("#rooms").append(new Room.view({model: room}).render());
        }
    }); 

    return {
        initialize: function() {
            var model = new Model();
            var view = new View({model: model});
            return {
                model: model,
                view: view
            };
        }
    };
})();

$(function(){
    var scheduler = Scheduler.initialize();

    var ballroom = new Room.model({name: "Ballroom"});
    var dance = new Event.model({name: "Glow Dance"});

    scheduler.model.rooms.add(ballroom);
    ballroom.events.add(dance);
});
