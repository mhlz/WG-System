//server.js

Meteor.publish("shopping-tours", function() {
	if(this.userId) {
		return shoppingTours.find();
	}
	return false;
});

Meteor.publish("shopping-items", function() {
	if(this.userId) {
		return shoppingItems.find();
	}
	return false;
});

Meteor.methods({
	insertShoppingAnnouncement: function(place, inTime) {
		if(Meteor.user().username == "") {
			return;
		}
		var time = Date.time();
		if(inTime == "in 15 Minuten") {
			time += 15 * 60 * 1000;
		} else if(inTime == "in 30 Minuten") {
			time += 30 * 60 * 1000;
		} else if(inTime == "in 45 Minuten") {
			time += 45 * 60 * 1000;
		} else if(inTime == "in 60 Minuten") {
			time += 60 * 60 * 1000;
		} else if(inTime == "in 2 Stunden") {
			time += 2 * 60 * 60 * 1000;
		} else if(inTime == "in 4 Stunden") {
			time += 4 * 60 * 60 * 1000;
		} else if(inTime == "in 5 Stunden") {
			time += 5 * 60 * 60 * 1000;
		} else if(inTime == "morgen") {
			time += 24 * 60 * 60 * 1000;
		} else if(inTime == "übermorgen") {
			time += 48 * 60 * 60 * 1000;
		} else if(inTime == "in 3 Tagen") {
			time += 3 * 24 * 60 * 60 * 1000;
		} else if(inTime == "in 1 Woche") {
			time += 7 * 24 * 60 * 60 * 1000;
		}
		shoppingTours.insert({place: place, user: Meteor.user().username, time: time});
	},
	
	deleteShoppingAnnouncement: function(tourId) {
		shoppingTours.remove({_id: tourId, user: Meteor.user().username});
	},
	
	insertShoppingItem: function(shoppingTourId, itemName, itemPrice) {
		if(Meteor.user().username == "") {
			return;
		}
		shoppingItems.insert({tour: shoppingTourId, itemName: itemName, itemPrice: itemPrice, orderedBy: Meteor.user().username});
	},
	
	deleteShoppingItem: function(itemId) {
		shoppingItems.remove({orderedBy: Meteor.user().username, _id: itemId});
	}
});

Meteor.startup(function() {
	/*var atime = new Date();
	atime = atime.getTime();
	shoppingTours.insert({place: "(vor 40 min)", user: "Mischa", time: atime - 40 * 60 * 1000});
	shoppingTours.insert({place: "(vor 29 min)", user: "Mischa", time: atime - 29 * 60 * 1000});
	shoppingTours.insert({place: "(vor 1 min)", user: "Mischa", time: atime - 1 * 60 * 1000});
	shoppingTours.insert({place: "(jetzt)", user: "Mischa", time: atime});
	shoppingTours.insert({place: "(in 40 stunden)", user: "Mischa", time: atime + 40 * 60 * 60 * 1000});*/
});
