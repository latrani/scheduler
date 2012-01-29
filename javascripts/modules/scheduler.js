/*global Backbone, Handlebars, _, Room */

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
