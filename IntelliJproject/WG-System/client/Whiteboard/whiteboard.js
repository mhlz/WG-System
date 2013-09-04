Meteor.subscribe("notes");
mouseOver = null;

Template.whiteboard.helpers({
    notes: function () {
        return Notes.find({},{sort: {date: -1}});
    }
});

Template.note.helpers({
    mouseOver: function() {
        return Session.equals("selected", this._id);
    },

    importance: function() {
        return this.importance * 15;
    },

    importance_fix: function() {
        return (100 / (this.importance * 15) )* 100;
    },

    isCreator: function() {
        return this.user == Meteor.userId();
    },

    color:  function() {
        random = (this.date * this.date * this.date) % (255 * 255 * 255);
        var hexString = random.toString(16);
        return hexString;
    }
});

Template.note.events({
    'mouseenter, tap, click': function() {
        Session.set("selected", this._id);
    },

    'click .important': function() {
        Meteor.call("Notes_important", this._id, true);
    },

    'click .unimportant': function() {
        Meteor.call("Notes_important", this._id, false);
    },

    'click .remove': function() {
        Meteor.call("Notes_remove", this._id);
    }
});


Template.addNote.events({
    'click .add': function() {
        Meteor.call("Notes_create", document.getElementById("newNote").value);
        document.getElementById("newNote").value = "";
    }
});