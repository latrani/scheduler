/*global Backbone, Handlebars, _, Room, Event */

var Scheduler = (function(){
    var Model = Backbone.Model.extend({
        initialize: function() {
            this.rooms = new Room.collection();
            this.events = new Event.collection(); // Staged events
        }
    });

    var Template = Handlebars.compile($("#scheduler-template").html());

    var View = Backbone.View.extend({ 
        events: {
            "click button.add-room": "willAddRoom",
            "click button.add-staged-event": "willAddEvent"
        },
 
        initialize: function() {
            _.bindAll(this, "addRoom", "willAddRoom", "addEvent", "willAddEvent");
            this.model.rooms.bind('add', this.addRoom);
            this.model.events.bind('add', this.addEvent);
        },
        render: function() { 
            return $(this.el).html(Template());
        },
        willAddRoom: function() {
            var name = prompt("Room name?");
            if (name) {
                this.model.rooms.add(new Room.model({name: name}));
            }
        },
        addRoom: function(room) {
          $(this.el).find(".rooms").append(new Room.view({model: room}).render());
        },
        willAddEvent: function() {
            var name = prompt("Event name?");
            if (name) {
                this.model.events.add(new Event.model({name: name}));
            }
        },
        addEvent: function(event) {
            console.log($(this.el));
            $(this.el).find(".staging").append(new Event.view({model: event}).render());
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
