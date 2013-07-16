
Meteor.subscribe("meals");
Meteor.subscribe("mealItems");


Template.mealList.helpers({
	meals: function() {
		return Meals.find({}, {sort: {name: 1}});
	}
});

Template.meal.helpers({
	selected: function() {
		return Session.equals("selected", this._id);
	},

	username: function() {
		if(Meteor.users.findOne({_id: this.userId}))
			return Meteor.users.findOne({_id: this.userId}).username;
		return "Error";
	},

	items: function() {
		return MealItems.find({mealId: this._id});
	},

	isCreator: function() {
		return Meteor.userId() == this.userId;
	}
});

Template.meal.events({
	'click': function() {
		if(!this.mealId)
			Session.set("selected",this._id);
	},
	'click .remove': function() {
		Meteor.call("deleteMeal",this._id);
	}
});

Template.addMeal.helpers({
	selected: function() {
		return Session.equals("selected", "newMeal");
	}
});

Template.addMeal.events({
	'click .add': function() {
		Session.set("selected","newMeal");
	},

	'click .submit': function() {
		Meteor.call("addMeal", document.getElementById("mealName").value);
		Session.set("selected","");
	}
});
