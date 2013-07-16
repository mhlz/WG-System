Meteor.subscribe("shopping-tours");
Meteor.subscribe("shopping-items");

function clearAllNewItems() {
	var items = document.getElementsByClassName("addNewname");
	for(var i = 0; i < items.length; i++) {
		items[i].value = "";
	}
	var items = document.getElementsByClassName("addNewprice");
	for(var i = 0; i < items.length; i++) {
		items[i].value = "";
	}
	var items = document.getElementsByClassName("addNewtimes");
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

Template.shopping.helpers({
    items: function() {
        return shoppingItems.find({},{sort: {place: 1}});
    }
});

Template.shoppingList.helpers({
    shoppingTours: function() {
        return shoppingTours.find({}, {sort: {time: 1, user: 1}});
    }
});

Template.shoppingTour.helpers({
    listItems: function() {
        if(Session.equals("selected", this._id)) {
            return shoppingItems.find({$or: [{place: this.place}, {place: ""}, {place: null}]},{sort: {name: 1}});
        } else {
            return shoppingItems.find({$or: [{place: this.place},{place: ""}, {place: null}]}, {sort: {name: 1}, limit: 2});
        }
    },

    selected: function() {
        if(Session.equals("selected", this._id)) {
            return "selected";
        }
        return "";
    },

    price: function () {
        items = shoppingItems.find({$or: [{place: this.place},{place: ""}]});
        price = 0;
        items.forEach(function (item) {
            price += parseFloat(item.price);
        });
        return price;
    },

    isDoneBy: function() {
        return this.user == Meteor.user().username;
    },

    showDots: function() {
        return shoppingItems.find({place: this.place}).count() > 2 && Session.get("selected") != this._id;
    },

    getNewListNumber: function() {
        return shoppingItems.find({place: this.place}).count() + 1;
    },

    showLessButton: function() {
        return Session.get("selected") == this._id && shoppingItems.find({tour: this._id}).count() > 2;
    },

    inFuture: function() {
		updateTimes()
        var atime = new Date();
        atime = atime.getTime();
        return atime < this.time;
    },

    ItemArgument: function() {
        return {placeHolder: {place: this.place}};
    }

});

Template.shoppingTour.events({

    'click' : function () {
        if(!this.orderedBy)
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

Template.announceDialog.helpers({
    addButton: function() {
        if(Session.equals("selected", "newTour")) {
            return "senden";
        }
        return "+";
    },

    selected: function() {
        if(Session.equals("selected", "newTour")) {
            return "selected";
        }
        return "";
    }
});

Template.announceDialog.events({
	"click .acceptAnnouncementButton": function() {
	    if(Session.equals("selected", "newTour")) {
		    Meteor.call("insertShoppingAnnouncement", document.getElementById("place").value, document.getElementById("timeSelect").value);
            Session.set("selected", "");
        }
        Session.set("selected","newTour");
	}
});



Meteor.startup(function() {
	$("body").height(window.innerHeight);
	updateTimes();
	Meteor.setInterval(updateTimes, 5000);
});
