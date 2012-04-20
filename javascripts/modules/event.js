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

    Handlebars.registerHelper('formatDates', function(start, end) {
        var result = "";
        if (start) {
            result += start.format("MM/DD/YYYY HH:mm");
        }
        if (end) {
            result += " &ndash; " + end.format("MM/DD/YYYY HH:mm");
        }
        return result;
    });

    var SimpleTemplate = Handlebars.compile($("#event-template").html());

    var SimpleView = Backbone.View.extend({
        className: 'event',
        events: {
            "click .edit": "edit"
        },
        
        initialize: function() {
            _.bindAll(this, "render", "durationChanged");
            this.model.on("change", this.render);
            this.model.on("change:duration", this.durationChanged);
            this.$el.data("backbone-view", this);
        },

        render: function() { 
            return this.$el.html(SimpleTemplate(this.model.attributes)).attr("id", "event-" + this.model.cid)
            .draggable({
                revert: true,
                scroll: false,
                zindex: 10
            });
        },
        durationChanged: function(event) {
            var milliseconds = this.model.get("duration");
            this.$el.height(milliseconds/60000);
        },
        edit: function(event) {
            Event.dialog.edit(this.model);
        }
    }); 

    var DialogView = Backbone.View.extend({
        initialize: function() {
            $("#event-dialog").dialog({
                autoOpen: false,
                modal: true
            })
            .find("input[type=date]").datepicker().end()
            .find("input[type=time]").timepicker().end();
            this.setElement($("#event-dialog"));
            _.bindAll(this, "create", "edit", "storeItem", "setDateTime");
        },

        create: function(collection) {
            var that = this;
            var $form = this.$el.find("form");
            var callback = function() {
                var item = new Event.model();
                collection.add(item);
                that.storeItem(item, $form.serializeObject());
                that.$el.dialog("close");
            };

            $form.unbind("submit").bind("submit", function(event) {
                    callback();
                    return false;
                })
                .get(0).reset();

            this.$el.dialog("option", {
                buttons: {
                    "Cancel": function() { $(this).dialog("close"); },
                    "Ok": callback
                }
            });
            this.$el.dialog("open");
        },

        edit: function(item) {
            var that = this;
            var $form = this.$el.find("form");
            var callback = function() {
                that.storeItem(item, $form.serializeObject());
                that.$el.dialog("close");
            };

            $form.unbind("submit").bind("submit", function(event) {
                    callback();
                    return false;
                })
                .get(0).reset();
            var fields = _(item.attributes).clone();
            if (fields.start) {
                fields._startdate = fields.start.format("MM/DD/YYYY");
                fields._starttime = fields.start.format("HH:mm");
            }
            if (fields.end) {
                fields._enddate = fields.end.format("MM/DD/YYYY");
                fields._endtime = fields.end.format("HH:mm");
            }
            $form.populate(fields);

            this.$el.dialog("option", {
                buttons: {
                    "Delete": function() { 
                        if (confirm("Are you sure?")) {
                            item.destroy();
                            $(this).dialog("close");
                        } 
                    },
                    "Cancel": function() { $(this).dialog("close"); },
                    "Ok": callback
                }
            });
            this.$el.dialog("open");
        },

        storeItem: function(item, fields) {
            _.each(_(fields).keys(), function(key){
                if (key[0] !== "_") {
                    item.set(key, fields[key]);
                }
            });
            this.setDateTime(item, fields, "start");
            this.setDateTime(item, fields, "end");
            return true;
        },

        setDateTime: function(item, fields, prefix) {
            var date = fields["_" + prefix + "date"];
            var time = fields["_" + prefix + "time"];
            if (!!date && !!time) {
                item.set(prefix, moment(date + " " + time, "MM/DD/YYYY HH:mm"));
            }
        }
    });

    return {
        model: Model,
        collection: Collection,
        view: SimpleView,
        dialog: new DialogView()
    };
})();
