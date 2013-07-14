
Meteor.publish("parties", function() {
    if(this.userId) {
        return Parties.find();
    }
    return false;
})

Meteor.publish("aproval", function() {
    if(this.userId) {
        return Aproval.find();
    }
    return false;
})

Meteor.methods({
    aproveParty: function(partyId, userId, aproved) {
        if(Aproval.find({partyId: partyId, userId: userId}).count() == 0){
            Aproval.insert({partyId: partyId, userId: userId, aproved: aproved});
        } else {
            Aproval.update({partyId: partyId, userId: userId},{partyId: partyId, userId: userId,aproved: aproved});
        }
    },

    addParty: function(name, detail, date, userId) {
        Parties.insert({name: name, detail: detail, date: date, userId: userId});
    },

    deleteParty: function(id) {
        Parties.remove({_id: id});
    }
});