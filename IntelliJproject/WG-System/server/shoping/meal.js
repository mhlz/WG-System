Meteor.publish("meals", function() {
	if(this.userId) {
		return Meals.find();
	}
	return false;
});

Meteor.publish("mealItems", function() {
	if(this.userId) {
		return MealItems.find();
	}
	return false;
});

Meteor.methods({
	addMeal: function(name) {
		Meals.insert({name: name, userId: Meteor.userId()});
	},

	deleteMeal: function(id) {
		Meals.remove({_id: id});
		MealItems.remove({mealId: id});
	},

	addMealItem: function(mealId, name, amount, price){
		MealItems.insert({mealId: mealId, name: name, amount: amount, price: price, userId: Meteor.userId()});
	},

	removeMealitem: function(id){
		MealItems.remove({_id: id});
	},

	changeMealPublic: function(id) {
		meal = Meals.findOne({_id:id});
		Meals.update({_id: id},{name: meal.name, userId: meal.userId, public: !meal.public});
	}
});