

Template.newItem.events({
	"click .addNewItem": function(event, template) {
		Meteor.call("insertShoppingItem", template.find("#place").value, template.find("#addNewtimes").value, template.find("#addNewname").value, template.find("#addNewprice").value);
		Session.set("selected", this._id);
		clearAllNewItems();
	}
});

Template.item.helpers({
	isOrderedBy: function() {
		return this.orderedBy == Meteor.user().username;
	},

	showDoneButton: function() {
		return !this.done;
	},

	done: function() {
		if(this.done) {
			return "done";
		}
		return "";
	}
});

Template.item.events({
	"click .deleteShoppingItem": function() {
		Meteor.call("deleteShoppingItem", this._id);
	},

	'click .doneShoppingItem': function() {
		Meteor.call("doneShoppingItem",this._id);
	}
});
