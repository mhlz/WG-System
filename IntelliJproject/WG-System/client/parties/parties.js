Meteor.subscribe("parties");
Meteor.subscribe("aproval");
Meteor.subscribe("userData");

Template.parties.helpers({
   parties: function() {
       var atime = new Date();
       atime = atime.getTime();
       return Parties.find({date: {$gt: (atime - 24 * 60 * 60 * 1000)}});
   }
});

Template.party.helpers({
    usersaproved : function() {
       return Meteor.users.find();
    },

    aproval: function() {
        if(Aproval.find({partyId: this._id, aproved: false}).count() != 0){
            return "X";
        }
        return Aproval.find({partyId: this._id, aproved: true}).count() + "/" + Meteor.users.find().count();
    },

    date: function() {
        var time = new Date(this.date);
        return time.getDate() + "." + (time.getMonth() + 1) + "." + time.getFullYear();
    },

    aproved: function() {
        if(Aproval.find({partyId: this._id, aproved: true}).count() == Meteor.users.find().count()) {
            return true;
        }
        return false;
    },

    notaproved: function() {
        return Aproval.find({partyId: this._id, aproved: false}).count() > 0;
    },

    selected: function() {
        return Session.equals("selected",this._id);
    },

    isCreator: function() {
        return Meteor.userId() == this.userId;
    }
});

Template.party.events({
    'click': function() {
        Session.set("selected",this._id);
    },

    'click .aprove': function() {
        Meteor.call("aproveParty", this._id, Meteor.userId(), true);
    },

    'click .disaprove': function() {
        Meteor.call("aproveParty", this._id, Meteor.userId(), false);
    },

    'click .remove': function() {
        Meteor.call("deleteParty",this._id);
    }
});

Template.useraproved.helpers({
    aproved: function(){
        if(Aproval.findOne({partyId: Session.get("selected"), userId: this._id}) == undefined){
            return false;
        }
        return Aproval.findOne({partyId: Session.get("selected"), userId: this._id}).aproved;
    },
    notaproved: function(){
        if(Aproval.findOne({partyId: Session.get("selected"), userId: this._id}) == undefined){
            return false;
        }
        return !Aproval.findOne({partyId: Session.get("selected"), userId: this._id}).aproved;
    }
});

Template.addParty.helpers({
    selected: function() {
        return Session.equals("selected", "newParty");
    },

    timePlaceholder: function() {
        var time = new Date();
        //return time.getFullYear() + "-" + time.getFullMonth() + "-" + time.getDay() + "T" + time.getHours() + ":" + time.getMinutes();
    }
});

Template.addParty.events({
   'click': function() {
       Session.set("selected", "newParty");
   },

   'click .submit': function() {
       if(new Date(document.getElementById("PartyTime").value).getTime() != NaN){
           Session.set("selected", "");
           Meteor.call("addParty", document.getElementById("PartyName").value, document.getElementById("PartyDetails").value, new Date(document.getElementById("PartyTime").value).getTime(), Meteor.userId());
       }
   }
});