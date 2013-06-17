
Meteor.publish("objects", function() {
    if(this.userId) {
        return Objects.find();
    }
})


Meteor.publish("owner", function() {
    if(this.userId) {
        return Owner.find();
    }
})

Meteor.startup(function () {
    // code to run on server at startup
});

Meteor.methods({
    insertObject : function (name, price) {
        Objects.insert({name: name, price: price, visible: "true"});
    },

    updateObject : function(id, name, price) {
        Objects.update({_id: id}, {name: name, price: price, visible: "true"});
    },

    removeObject : function(id) {
         ob = Objects.findOne({_id: id});
         Objects.update({_id: id}, {name: ob.name, price: ob.price, visible: "false"});
     },

    undo : function(type, id) {
        if(type == "Object") {
            ob = Objects.findOne({_id: id});
            Objects.update({_id: id}, {name: ob.name, price: ob.price, visible: "true"});
        }else if(type == "Owner") {
            ow = Owner.findOne({_id: id});
            Owner.update({_id: id}, {objectId: ow.objectId, name: ow.name, money: ow.money, visible: "true"});
        }
    },

    addOwner : function(objectId, name, money) {
        ob = Objects.findOne({_id: objectId});
        Owner.insert({objectId: objectId, name: name, money: money, visible: "true"});
    },

    updateOwner : function(id, name, money) {
        ow = Owner.findOne({_id: id});
        Owner.update({_id: id}, {objectId: ow.objectId, name: name, money: money, visible: "true"});
    },

    removeOwner : function(id) {
        ow = Owner.findOne({_id: id});
        Owner.update({_id: id}, {objectId: ow.objectId, name: ow.name, money: ow.money, visible: "false"});
    },

    sendEmail : function(from,to,subject,text) {
        Email.send({
              to: to,
              from: from,
              subject: subject,
              text: text
            });
    }
});
