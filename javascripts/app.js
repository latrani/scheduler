/*global Backbone, Handlebars, _, Event, Room, Scheduler */

$(function(){
    var scheduler = Scheduler.initialize();
    $("body").append(scheduler.view.render());

    var ballroom = new Room.model({name: "Ballroom"});
    var panelroom = new Room.model({name: "Panel Room"});
    var dance = new Event.model({name: "Glow Dance"});
    var panel = new Event.model({name: "Postfurry Panel"});

    scheduler.model.rooms.add(ballroom);
    ballroom.events.add(dance);
    scheduler.model.rooms.add(panelroom);
    panelroom.events.add(panel);
});
