/*global Backbone, Handlebars, _, Event */

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
