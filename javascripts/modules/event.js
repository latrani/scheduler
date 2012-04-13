/*global Backbone, Handlebars, _, moment */

var Event = (function(){
    var Model = Backbone.Model.extend({
        // Attributes:
        //   name: string
        //   start: moment
        //   end: moment
        //   duration: milliseconds

        initialize: function() {
            _.bindAll(this, "updateDuration");
            this.on("change:start change:end", this.updateDuration);
            this.on("change:duration", this.setDuration);
        },

        updateDuration: function(event) {
            if (!!this.get("start") && !!this.get("end")) {
                this.set("duration", this.get("end") - this.get("start"));
            }
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
            return this.$el
                .html(SimpleTemplate(this.model.attributes))
                .find("input[type=date]").datepicker().end()
                .find("input[type=time]").timepicker().end();
        },

        changeStart: function(event) {
            var date = this.$el.find(".start-date").val();
            var time = this.$el.find(".start-time").val();
            if (!!date && !!time) {
                this.model.set("start", moment(date + " " + time, "MM/DD/YYYY HH:mm"));
            }
        },
        changeEnd: function(event) {
            var date = this.$el.find(".end-date").val();
            var time = this.$el.find(".end-time").val();
            if (!!date && !!time) {
                this.model.set("end", moment(date + " " + time, "MM/DD/YYYY HH:mm"));
            }
        },
        durationChanged: function(event) {
            var milliseconds = this.model.get("duration");
            this.$el.height(milliseconds/60000);
        }
    }); 

    var DialogView = Backbone.View.extend({
        initialize: function() {
            $("#event-dialog").dialog({
                autoOpen: false,
                modal: true
            });

            this.setElement($("#event-dialog"));
            _.bindAll(this, "create");
        },

        create: function(collection) {
            var that = this;
            var $form = this.$el.find("form");
            var createCB = function() {
                collection.add(new Event.model($form.serializeObject()));
                that.$el.dialog("close");
            };

            $form.unbind("submit").bind("submit", function(event) {
                    createCB();
                    return false;
                })
                .get(0).reset();

            this.$el.dialog("option", {
                buttons: {
                    "Cancel": function() { $(this).dialog("close"); },
                    "Ok": createCB
                }
            });
            this.$el.dialog("open");
        }
    });

    return {
        model: Model,
        collection: Collection,
        view: SimpleView,
        dialog: new DialogView()
    };
})();
