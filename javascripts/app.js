/*global Backbone, Handlebars, _, Event, Room, Scheduler */

$(function(){
    var scheduler = Scheduler.initialize();
    $("body").append(scheduler.view.render());

    var ballroom = new Room.model({name: "Ballroom"});
    var dance = new Event.model({name: "Glow Dance"});

    scheduler.model.rooms.add(ballroom);
    ballroom.events.add(dance);
});
