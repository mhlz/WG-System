Meteor.publish("Games", function() {
    if(this.userId) {
        return Games.find();
    }
})

Meteor.methods({
    addGame: function (name) {
        Games.insert({name: name});
    }
});