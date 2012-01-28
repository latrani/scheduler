$(function(){
    /*global Backbone, Handlebars */
    var Track = Backbone.Model.extend({
    });

    var TrackList = Backbone.Collection.extend({
        model: Track
    });

    var Room = Backbone.Model.extend({
    });

    var RoomList = Backbone.Collection.extend({
        model: Room
    });

    var Event = Backbone.Model.extend({
    });

    var EventList = Backbone.Collection.extend({
        model: Event
    });

    var EventTemplate = Handlebars.compile($("#event-template").html());

    var EventView = Backbone.View.extend({  
      render : function() { 
        $(this.el).html(EventTemplate());
      }  
    });  

    var event1 = new Event({name: "Glow Dance"});
});
