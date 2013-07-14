Meteor.publish("Tournaments", function() {
    if(this.userId) {
        return Tournaments.find();
    }
})

Meteor.methods({
    addTournaments: function (name, game) {
        Games.insert({name: name});
    }
});