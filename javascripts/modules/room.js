/*global Backbone, Handlebars, _, Event */

var Room = (function(){
    var Model = Backbone.Model.extend({
        // Attributes:
        //   name: string

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
        },
        render: function() { 
            return this.$el.html(SimpleTemplate(this.model.attributes));
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
