/*global Backbone, Handlebars, _, moment */

var Event = (function(){
    var Model = Backbone.Model.extend({
        // Attributes:
        //   name: string
        //   start: moment
        //   end: moment
        //   duration: milliseconds

        initialize: function() {
            _.bindAll(this, "updateDuration", "setDuration");
            this.on("change:start change:end", this.updateDuration);
            this.on("change:duration", this.setDuration);
        },

        updateDuration: function(event) {
            if (!!this.get("start") && !!this.get("end")) {
                this.set("duration", this.get("end") - this.get("start"));
            }
        },

        setDuration: function(event) {
            console.log("Duration set to", this.get("duration"));
        }
    });

    var Collection = Backbone.Collection.extend({
        model: Model
    });

    var SimpleTemplate = Handlebars.compile($("#event-template").html());

    var SimpleView = Backbone.View.extend({
        className: 'event',
        events: {
            "change .start-fields input": "changeStart",
            "change .end-fields input": "changeEnd"
        },
        
        initialize: function() {
            _.bindAll(this, "changeStart", "changeEnd", "durationChanged");
            this.model.on("change:duration", this.durationChanged);
        },

        render: function() { 
            var element = $(this.el).html(SimpleTemplate(this.model.attributes));
            element.find("input[type=date]").datepicker();
            element.find("input[type=time]").timepicker();
            return element;
        },

        changeStart: function(event) {
            var date = $(this.el).find(".start-date").val();
            var time = $(this.el).find(".start-time").val();
            if (!!date && !!time) {
                this.model.set("start", moment(date + " " + time, "MM/DD/YYYY HH:mm"));
            }
        },
        changeEnd: function(event) {
            var date = $(this.el).find(".end-date").val();
            var time = $(this.el).find(".end-time").val();
            if (!!date && !!time) {
                this.model.set("end", moment(date + " " + time, "MM/DD/YYYY HH:mm"));
            }
        },
        durationChanged: function(event) {
            var milliseconds = this.model.get("duration");
            $(this.el).height(milliseconds/60000);
        }
    }); 

    return {
        model: Model,
        collection: Collection,
        view: SimpleView
    };
})();
