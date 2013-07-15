Meteor.subscribe("shopping-tours");
Meteor.subscribe("shopping-items");

function clearAllNewItems() {
	var items = document.getElementsByClassName("addNewItemName");
	for(var i = 0; i < items.length; i++) {
		items[i].value = "";
	}
	var items = document.getElementsByClassName("addNewItemPrice");
	for(var i = 0; i < items.length; i++) {
		items[i].value = "";
	}
	var items = document.getElementsByClassName("addNewItemTimes");
    	for(var i = 0; i < items.length; i++) {
    		items[i].value = "";
    	}
}

function updateTimes() {
	var times = document.getElementsByClassName("updatingTime");
	var atime = new Date();
	atime = atime.getTime();
	for(var i = 0; i < times.length; i++) {
		var difftime = Math.round((times[i].getAttribute("data-time") - atime) / 1000);
		var unit = "";
		var word = "";
		if(difftime < 0) {
			word = "vor";
		} else {
			word = "in";
		}
		var timeabs = Math.round(Math.abs(difftime));
		unit = "Sek.";
		if(timeabs > 59) {
			timeabs = Math.round(timeabs / 60);
			unit = "Min.";
			if(difftime < 0 && timeabs >= 30) {
				//document.getElementById("shoppingTour_" + times[i].getAttribute("data-tourId")).style.display = "none";
			}
			if(timeabs > 59) {
				timeabs = Math.round(timeabs/ 60);
				unit = "Std.";
				if(timeabs > 23) {
					timeabs = Math.round(timeabs / 24);
					unit = "T.";	
					if(timeabs > 6) {
						timeabs = Math.round(timeabs / 7);
						unit = "W."
					}
				}
			}
		}
		times[i].innerHTML = word + " " + String(timeabs) + " " + unit;
	}
}	

Template.shopping.items = function() {
    return shoppingItems.find({},{sort: {itemPlace: 1}});
}

Template.shoppingList.shoppingTours = function() {
	return shoppingTours.find({}, {sort: {time: 1, user: 1}});
};

Template.shoppingTour.listItems = function() {
	if(Session.get("selected") == this._id) {
		return shoppingItems.find({$or: [{itemPlace: this.place},{itemPlace: ""}]});
	} else {
		return shoppingItems.find({$or: [{itemPlace: this.place},{itemPlace: ""}]}, {limit: 2});
	}
};

Template.shoppingTour.selected = function() {
	if(Session.equals("selected", this._id)) {
	    return "selected";
	}
	return "";
};

Template.shoppingTour.price = function () {
    items = shoppingItems.find({$or: [{itemPlace: this.place},{itemPlace: ""}]});
    price = 0;
    items.forEach(function (item) {
        price += parseFloat(item.itemPrice);
    });
    return price;
}

Template.shoppingTour.isDoneBy = function() {
	return this.user == Meteor.user().username;
};

Template.shoppingTour.showDots = function() {
	return shoppingItems.find({place: this.place}).count() > 2 && Session.get("selected") != this._id;
};

Template.shoppingTour.getNewListNumber = function() {
	return shoppingItems.find({place: this.place}).count() + 1;
};

Template.shoppingTour.showLessButton = function() {
	return Session.get("selected") == this._id && shoppingItems.find({tour: this._id}).count() > 2;
};

Template.shoppingTour.inFuture = function() {
	var atime = new Date();
	atime = atime.getTime();
	return atime < this.time;
};

Template.shoppingList.rendered = function() {
	updateTimes();
	Meteor.setInterval(updateTimes, 1000);
};
		
Template.shoppingTour.ItemArgument = function() {
    return {placeHolder: {place:this.place}};
};

Template.shoppingTour.events({

    'click' : function (event) {
        if(this._id)
            Session.set("selected", this._id);
    },
	
	"click .deleteShoppingAnnouncement": function() {
		Meteor.call("deleteShoppingAnnouncement", this._id);
	},
	
	"click .showMore": function() {
		Session.set("selected", this._id);
	},
	
	"click .showLess": function() {
		Session.set("selected", "");
	}
});	

Template.item.done = function() {
    if(shoppingItems.findOne({_id: this._id}).done == true) {
        return "done";
    }
    return "";
};

Template.item.showDoneButton= function() {
	return !shoppingItems.findOne({_id: this._id}).done;
};

Template.item.events({
	"click .deleteShoppingItem": function() {
		Meteor.call("deleteShoppingItem", this._id);
	},

	'click .doneShoppingItem': function() {
	    Meteor.call("doneShoppingItem",this._id);
    }
});

Template.newItem.events({
	"click .addNewItem": function(event, template) {
		Meteor.call("insertShoppingItem", template.find("#place").value, template.find("#addNewItemTimes").value, template.find("#addNewItemName").value, template.find("#addNewItemPrice").value);
		Session.set("selected", this._id);
		clearAllNewItems();
	},
});


Template.announceDialog.addButton = function() {
	if(Session.equals("selected", "newTour")) {
	    return "senden";
	}
	return "+";
}

Template.announceDialog.selected = function() {
	if(Session.equals("selected", "newTour")) {
	    return "selected";
	}
	return "";
}

Template.announceDialog.events({
	"click .acceptAnnouncementButton": function() {
	    if(Session.equals("selected", "newTour")) {
		    Meteor.call("insertShoppingAnnouncement", document.getElementById("place").value, document.getElementById("timeSelect").value);
            Session.set("selected", "");
        }
        Session.set("selected","newTour");
	}
});

Template.item.isOrderedBy = function() {
	return this.orderedBy == Meteor.user().username;
};

Meteor.startup(function() {
	$("body").height(window.innerHeight);
});
