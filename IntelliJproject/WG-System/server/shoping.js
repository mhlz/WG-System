//server.js
function sendEmail(from, to, subject, text) {
     Email.send({
          to: to,
          from: from,
          subject: subject,
          text: text
        });
}


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
		var time = new Date();
		time = time.getTime();
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
		item = shoppingTours.insert({place: place, user: Meteor.user().username, time: time});
		users = Meteor.users.find();
		users.forEach(function(user) {
            sendEmail("best-wg-euw@meteor.com", user.emails[0].address, Meteor.user().username + " geht " + inTime + "Einkaufen bei " + place, " Äußere deine Wünsche auf http://best-wg-euw.meteor.com");
		})

	},
	
	deleteShoppingAnnouncement: function(tourId) {
	    tour = shoppingTours.findOne({_id: tourId});
		shoppingTours.remove({_id: tourId, user: Meteor.user().username});
		shoppingItems.remove({done: true, itemPlace: tour.place});
		shoppingItems.remove({done: true, itemPlace: ""});
	},
	
	insertShoppingItem: function(itemPlace, itemTimes, itemName, itemPrice) {
		if(Meteor.user().username == "") {
			return;
		}
		shoppingItems.insert({itemPlace: itemPlace, itemName: itemName, itemTimes: itemTimes, itemPrice: itemPrice, orderedBy: Meteor.user().username, done: false});
	},
	
	deleteShoppingItem: function(itemId) {
		shoppingItems.remove({_id: itemId});
	},

	doneShoppingItem: function(itemId) {
	    item = shoppingItems.findOne({_id: itemId});
	    shoppingItems.update({_id: itemId},{orderedBy: item.orderedBy, itemPlace: item.itemPlace, itemTimes: item.itemTimes, itemName: item.itemName, itemPrice: item.itemPrice, done: true})
	}
});

Meteor.startup(function() {
    //sendEmail("best-wg-euw@meteor.com","reckt3r@gmail.com","Server Started up", "Meteor.startup() just got called.");
	/*var atime = new Date();
	atime = atime.getTime();
	shoppingTours.insert({place: "(vor 40 min)", user: "Mischa", time: atime - 40 * 60 * 1000});
	shoppingTours.insert({place: "(vor 29 min)", user: "Mischa", time: atime - 29 * 60 * 1000});
	shoppingTours.insert({place: "(vor 1 min)", user: "Mischa", time: atime - 1 * 60 * 1000});
	shoppingTours.insert({place: "(jetzt)", user: "Mischa", time: atime});
	shoppingTours.insert({place: "(in 40 stunden)", user: "Mischa", time: atime + 40 * 60 * 60 * 1000});*/
});
