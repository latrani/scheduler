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
        className: 'scheduler',
        events: {
            "click button.add-room": "addRoom",
            "click button.add-staged-event": "addEvent"
        },
 
        initialize: function() {
            _.bindAll(this, "addRoom", "roomAdded", "addEvent", "eventAdded");
            this.model.rooms.bind('add', this.roomAdded);
            this.model.events.bind('add', this.eventAdded);
        },
        render: function() { 
            return $(this.el).html(Template());
        },
        addRoom: function() {
            var name = prompt("Room name?");
            if (name) {
                this.model.rooms.add(new Room.model({name: name}));
            }
        },
        roomAdded: function(room) {
          $(this.el).find(".rooms").append(new Room.view({model: room}).render());
        },
        addEvent: function() {
            var name = prompt("Event name?");
            if (name) {
                this.model.events.add(new Event.model({name: name}));
            }
        },
        eventAdded: function(event) {
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
