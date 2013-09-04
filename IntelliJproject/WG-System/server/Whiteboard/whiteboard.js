/**
 * Created with JetBrains WebStorm.
 * User: reckter
 * Date: 8/29/13
 * Time: 9:28 PM
 * To change this template use File | Settings | File Templates.
 */
Meteor.publish("notes", function() {
    if(this.userId) {
        return Notes.find();
    }
})



Meteor.methods({
    Notes_create: function(text) {
        var atime = new Date();
        atime = atime.getTime();
        Notes.insert({text: text, user: Meteor.userId(), date: atime, importance: 10});
    },

    Notes_important: function(_id, important) {
        var note = Notes.findOne({_id: _id});
        if(important){
            var importance = note.importance + 1;
        } else {
            var importance = note.importance - 1;
        }
        Notes.update({_id: _id},{importance: importance, text: note.text, user: note.user, date: note.date});
    },

    Notes_remove: function(_id) {
        var note = Notes.findOne({_id: _id});
        if(note.user != Meteor.userId()) {
            return;
        }
        Notes.remove({_id: _id});
    }

});