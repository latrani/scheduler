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
        events: {
            "click button.add-event": "willAddEvent"
        },

        initialize: function() {
            _.bindAll(this, "addEvent", "willAddEvent");
            this.model.events.bind('add', this.addEvent);
        },
        render: function() { 
            return $(this.el).html(SimpleTemplate(this.model.attributes));
        },
        willAddEvent: function() {
            var name = prompt("Name?");
            this.model.events.add(new Event.model({name: name}));
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

    var Template = Handlebars.compile($("#scheduler-template").html());

    var View = Backbone.View.extend({ 
        events: {
            "click button.add-room": "willAddRoom"
        },
 
        initialize: function() {
            _.bindAll(this, "addRoom", "willAddRoom");
            this.model.rooms.bind('add', this.addRoom);
        },
        render: function() { 
            return $(this.el).html(Template());
        },
        willAddRoom: function() {
            var name = prompt("Name?");
            this.model.rooms.add(new Room.model({name: name}));
        },
        addRoom: function(room) {
          $(this.el).find(".rooms").append(new Room.view({model: room}).render());
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
    $("body").append(scheduler.view.render());

    var ballroom = new Room.model({name: "Ballroom"});
    var dance = new Event.model({name: "Glow Dance"});

    scheduler.model.rooms.add(ballroom);
    ballroom.events.add(dance);
});
