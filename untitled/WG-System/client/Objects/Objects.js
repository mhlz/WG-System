Meteor.subscribe("objects");
Meteor.subscribe("owner");


Template.Objects.objects = function () {
    return Objects.find({visible: "true"},{sort: {name:1}});
}

Template.oneObject.owners = function () {
    return Owner.find({objectId: this._id, visible: "true"},{sort: {name:1}});
}

Template.oneObject.selected = function () {
    if(Session.equals("selectedObject", this._id)) {
        return "selected";
    }
    return "";
}

Template.oneObject.visible = function () {
    if(Session.equals("selectedObject", this._id)) {
        return "block";
    }
    return "none";
}

Template.oneObject.visible_edit = function () {
    if(Session.equals("EditObject", this._id)) {
        if(!Session.equals("selectedObject", this._id)){
            Session.set("EditObject", "");
            return "none";
        }
        return "block";
    }
    return "none";
}

Template.oneObject.visible_unedit = function () {
    if(Session.equals("EditObject", this._id)) {
        return "none";
    }
    return "block";
}

Template.oneObject.warning = function () {
    owner = Owner.find({objectId: this._id, visible: "true"},{sort: {name:1}});
    money = 0;
    owner.forEach(function(ow) {
        money += parseInt(ow.money);
    });
    if(money > this.price)
        return "The price is overdone!";

    if(money < this.price)
        return "The price is not reached!";

   return "";
}

Template.oneObject.events =  ({
    'click .edit' : function () {
        if(Session.equals("EditObject",this._id)) {
            Meteor.call("updateObject", this._id, document.getElementById("name_" + this._id).value, document.getElementById("price_" + this._id).value);
            Session.set("EditObject", "");
        }
        Session.set("EditObject", this._id);
    },

    'click #removeObject' : function () {
        Meteor.call("removeObject",this._id);
        Session.set("lastRemovedId",this._id);
        Session.set("lastRemovedType", "Object");
        var date = new Date();
        Session.set("lastRemovedTime", date.getTime());

        window.setTimeout(removeUndo, 60 * 1000);
    },

    'click' : function () {
        if(!Session.equals("selectedObject",this.objectId))
            Session.set("selectedObject", this._id);
    }
});

Template.newObject.selected = function () {
    if(Session.equals("selectedObject", "newObject")) {
        return "selected";
    }
    return "";
}

Template.newObject.visible = function () {
    if(Session.equals("selectedObject", "newObject")) {
        return "block";
    }
    return "none";
}

Template.newObject.submit = function () {
    if(Session.equals("selectedObject", "newObject")) {
        return "add";
    }
    return "+";
}

Template.newObject.undo = function () {
        var date = new Date();
    if(!Session.equals("selectedObject", "newObject") && (date.getTime() - Session.get("lastRemovedTime") < 60 * 1000)) {
        return "block";
    }
    return "none";
}

Template.newObject.events = ({
    'click .add' : function () {
        if(Session.equals("selectedObject", "newObject")) {
            Meteor.call("insertObject", document.getElementById("name").value, document.getElementById("price").value);
            document.getElementById("name").value = "";
            document.getElementById("price").value = "";
            return;
        }
        Session.set("selectedObject", "newObject");
    },

    'click .undo' : function () {
        Meteor.call("undo", Session.get("lastRemovedType"), Session.get("lastRemovedId"));
        Session.set("lastRemovedId", "");
        Session.set("lastRemovedType", "");
        Session.set("lastRemovedTime", 0);
        Session.set("selectedObject", "");
    },
});



Template.owner.percentage = function () {
    ob = Objects.findOne({_id: this.objectId});
    return this.money / ob.price * 100;
}



Template.owner_edit.percentage = function () {
    if(Session.equals("EditObject", this._id))
        return document.getElementById("money_" + this._id).value / document.getElementById("price_" + this.objectId).value * 100;
}

Template.owner_edit.events = ({
    'click .remove' : function() {
        Meteor.call("removeOwner", this._id);
        Session.set("lastRemovedId", this._id);
        Session.set("lastRemovedType", "Owner");
        var date = new Date();
        Session.set("lastRemovedTime", date.getTime());

        window.setTimeout(removeUndo, 60 * 1000);
    },

    'click .save' : function() {
        Meteor.call("updateOwner", this._id, document.getElementById("name_" + this._id).value, document.getElementById("money_" + this._id).value);
    }
})


Template.addOwner.percentage = function () {
    if(document.getElementById("moneyOwner") != null)
        return document.getElementById("moneyOwner" + this._id).value / this.price * 100;
}

Template.addOwner.events = ({
    'click .add' : function () {
        Meteor.call("addOwner", this._id, document.getElementById("nameOwner_" + this._id).value, document.getElementById("moneyOwner_" + this._id).value);
        document.getElementById("nameOwner_" + this._id).value = "";
        document.getElementById("moneyOwner_" + this._id).value = "";
    }
})


Meteor.startup(function () {
});
