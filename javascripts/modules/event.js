/*global Backbone, Handlebars, _ */

var Event = (function(){
    var Model = Backbone.Model.extend({
        // name: string
        // track: string
    });

    var Collection = Backbone.Collection.extend({
        model: Model
    });

    var SimpleTemplate = Handlebars.compile($("#event-template").html());

    var SimpleView = Backbone.View.extend({  
        render: function() { 
            return $(this.el).html(SimpleTemplate(this.model.attributes));
        }  
    }); 

    return {
        model: Model,
        collection: Collection,
        view: SimpleView
    };
})();
