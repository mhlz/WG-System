
Meteor.subscribe("mealItems");

Template.addMealItem.events({
	'click .add': function() {
		Meteor.call("addMealItem", this._id, document.getElementById("mealItemName_" + this._id).value, document.getElementById("mealItemAmount_" + this._id).value, document.getElementById("mealItemPrice_" + this._id).value);
	}
});

Template.mealItem.helpers({
	isCreator: function() {
		return Meteor.userId() == this.userId;
	}
});

Template.mealItem.events({
	'click .remove': function() {
		Meteor.call("removeMealitem", this._id);
	}
});