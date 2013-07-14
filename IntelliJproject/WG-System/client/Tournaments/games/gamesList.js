Template.gamesList.helpers({
    games: function(){
      return Games.find({},{sort: {names: 1}});
    }
});


Template.game.helpers({
    selected: function () {
        if(Session.equals("tournament_gameSelected",this._id)) {
            return true;
        }
        return false;
    }
});

Template.game.events({
   'click': function() {
       Session.set("tournament_gameSelected",this._id);
   }
});

Template.addGame.helpers({
    selected: function () {
        return Session.equals("tournament_gameSelected","new");
    }
});

Template.addGame.events({
    'click .add': function () {
        Session.set("tournament_gameSelected","new");
    },

    'click -submit': function () {

    }
});
