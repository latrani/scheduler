/*global Backbone, Handlebars, _, moment, Event */

var Room = (function(){
    var Model = Backbone.Model.extend({
        // Attributes:
        //   name: string
        defaults: {
            slots: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
            day: moment("2012-05-01", "YYYY-MM-DD")
        },

        initialize: function() {
            this.events = new Event.collection();
        }
    });

    var Collection = Backbone.Collection.extend({
        model: Model
    });

    var SimpleTemplate = Handlebars.compile($("#room-template").html());

    var SimpleView = Backbone.View.extend({
        className: 'room',
        events: {
            "click button.add-event": "addEvent"
        },

        initialize: function() {
            _.bindAll(this, "addEvent", "eventAdded", "eventRemoved");
            this.model.events.bind('add', this.eventAdded);
            this.model.events.bind('remove', this.eventRemoved);
            this.$el.data("backbone-view", this);
        },
        render: function() { 
            var that = this;
            return this.$el.html(SimpleTemplate(this.model.attributes)).attr("id", "room-" + this.model.cid)
            .find(".slot").droppable({
                hoverClass: "accept",
                drop: function(event, ui) {
                    var eventModel = ui.draggable.data("backbone-view").model;
                    if (eventModel.collection) {
                        var offset = $(this).position().top * 2;
                        // TOOD: Maybe shit should be done elsewhere?
                        var start = that.model.get("day").clone().add("m", offset);
                        var end = start.clone().add("ms", eventModel.get("duration"));
                        eventModel.set({start: start, end: end});
                        eventModel.collection.remove(eventModel);
                        that.model.events.add(eventModel);
                    }
                }
            }).end();
        },
        addEvent: function() {
            Event.dialog.create(this.model.events);
        },
        eventAdded: function(event) {
            this.$el.find(".events").append(new Event.view({model: event}).render());
        },
        eventRemoved: function(event) {
            this.$el.find(".events").find("#event-" + event.cid).remove();
        }
    }); 

    return {
        model: Model,
        collection: Collection,
        view: SimpleView
    };
})();
