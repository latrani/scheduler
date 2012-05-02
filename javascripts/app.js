/*global Backbone, Handlebars, _, Event, Room, Scheduler */


jQuery.fn.serializeObject = function() {
  var arrayData, objectData;
  arrayData = this.serializeArray();
  objectData = {};

  $.each(arrayData, function() {
    var value;

    if (this.value != null) {
      value = this.value;
    } else {
      value = '';
    }

    if (objectData[this.name] != null) {
      if (!objectData[this.name].push) {
        objectData[this.name] = [objectData[this.name]];
      }

      objectData[this.name].push(value);
    } else {
      objectData[this.name] = value;
    }
  });

  return objectData;
};

$(function(){
    var scheduler = Scheduler.initialize();
    $("body").append(scheduler.view.render());

    var ballroom = new Room.model({name: "Ballroom"});
    var panelroom = new Room.model({name: "Panel Room"});
    var dance = new Event.model({name: "Glow Dance"});
    var panel = new Event.model({name: "Postfurry Panel"});

    scheduler.model.rooms.add(ballroom);
    scheduler.model.rooms.add(panelroom);
    scheduler.model.events.add(dance);
    scheduler.model.events.add(panel);

});
