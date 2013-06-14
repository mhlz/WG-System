Meteor.subscribe("shopping-tours");
Meteor.subscribe("shopping-items");

Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
});

function clearAllNewItems() {
	var items = document.getElementsByClassName("addNewItemName");
	for(var i = 0; i < items.length; i++) {
		items[i].value = "";
	}
	var items = document.getElementsByClassName("addNewItemPrice");
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
				document.getElementById("shoppingTour_" + times[i].getAttribute("data-tourId")).style.display = "none";
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
	
Template.shoppingList.shoppingTours = function() {
	var dtime = new Date();
	dtime = dtime.getTime();
	dtime -= 30 * 60 * 1000;
	return shoppingTours.find({time: {$gt: dtime}}, {sort: {time: 1, user: 1}});
};

Template.shoppingTour.listItems = function() {
	if(Session.get("lookingAtTour") == this._id) {
		return shoppingItems.find({tour: this._id});
	} else {
		return shoppingItems.find({tour: this._id}, {limit: 2});
	}
};

Template.shoppingTour.isDoneBy = function() {
	return this.user == Meteor.user().username;
};

Template.shoppingTour.showDots = function() {
	return shoppingItems.find({tour: this._id}).count() > 2 && Session.get("lookingAtTour") != this._id;
};

Template.shoppingTour.getNewListNumber = function() {
	return shoppingItems.find({tour: this._id}).count() + 1;
};

Template.shoppingTour.showLessButton = function() {
	return Session.get("lookingAtTour") == this._id && shoppingItems.find({tour: this._id}).count() > 2;
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
		

Template.shoppingTour.events({
	"click .addNewItem": function() {
		Meteor.call("insertShoppingItem", this._id, document.getElementById("addNewItemName_" + this._id).value, document.getElementById("addNewItemPrice_" + this._id).value);
		Session.set("lookingAtTour", this._id);
		clearAllNewItems();
	},
	
	"click .deleteShoppingAnnouncement": function() {
		Meteor.call("deleteShoppingAnnouncement", this._id);
	},
	
	"click .showMore": function() {
		Session.set("lookingAtTour", this._id);
	},
	
	"click .showLess": function() {
		Session.set("lookingAtTour", "");
	}
});	

Template.listItem.events({
	"click .deleteShoppingItem": function() {
		Meteor.call("deleteShoppingItem", this._id);
	}
});

Template.announceDialog.events({
	"click .acceptAnnouncementButton": function() {
		Meteor.call("insertShoppingAnnouncement", document.getElementById("nameOfPlace").value, document.getElementById("timeSelect").value);
	}
});

Template.listItem.isOrderedBy = function() {
	return this.orderedBy == Meteor.user().username;
};

Meteor.startup(function() {
	$("body").height(window.innerHeight);
});
