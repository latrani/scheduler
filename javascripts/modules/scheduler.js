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
        id: 'scheduler',
        events: {
            "click button.add-room": "addRoom",
            "click button.add-staged-event": "addEvent"
        },
 
        initialize: function() {
            _.bindAll(this, "addRoom", "roomAdded", "addEvent", "eventAdded", "eventRemoved");
            this.model.rooms.bind('add', this.roomAdded);
            this.model.events.bind('add', this.eventAdded);
            this.model.events.bind('remove', this.eventRemoved);
        },
        render: function() {
            var that = this;
            return this.$el.html(Template()).find(".staging-panel").droppable({
                    drop: function(event, ui) {
                        var eventModel = ui.draggable.data("backbone-view").model;
                        if (eventModel.collection && eventModel.collection !== that.model.events) {
                            eventModel.collection.remove(eventModel);
                            that.model.events.add(eventModel);
                        }
                    }
            }).end();
        },
        addRoom: function() {
            var name = prompt("Room name?");
            if (name) {
                this.model.rooms.add(new Room.model({name: name}));
            }
        },
        roomAdded: function(room) {
            this.$el.find(".rooms").append(new Room.view({model: room}).render());
        },
        addEvent: function() {
            Event.dialog.create(this.model.events);
        },
        eventAdded: function(event) {
            this.$el.find(".staging").append(new Event.view({model: event}).render());
        },
        eventRemoved: function(event) {
            this.$el.find(".staging").find("#event-" + event.cid).remove();
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
