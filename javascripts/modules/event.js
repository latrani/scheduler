/*global Backbone, Handlebars, _ */

var Event = (function(){
    var Model = Backbone.Model.extend({
        // name: string
        // track: string
        // start: date
        // end: date
    });

    var Collection = Backbone.Collection.extend({
        model: Model
    });

    var SimpleTemplate = Handlebars.compile($("#event-template").html());

    var SimpleView = Backbone.View.extend({
        events: {
            "change .start-fields input": "changeStart",
            "change .end-fields input": "changeEnd"
        },
        
        initialize: function() {
            _.bindAll(this, "changeStart", "changeEnd");
        },

        render: function() { 
            var element = $(this.el).html(SimpleTemplate(this.model.attributes));
            element.find("input[type=date]").datepicker();
            element.find("input[type=time]").timepicker();
            return element;
        },

        changeStart: function(event) {
            console.log("changeStart", event);
        },
        changeEnd: function(event) {
            console.log("changeEnd", event);
        }
    }); 

    return {
        model: Model,
        collection: Collection,
        view: SimpleView
    };
})();
