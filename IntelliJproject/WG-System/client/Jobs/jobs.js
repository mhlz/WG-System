Meteor.subscribe("jobs");
Meteor.subscribe("userJobs");

Template.jobs.helpers({
    users: function() {
        return Meteor.users.find({},{sort:{username :1}});
    }
});

Template.userJob.helpers({
    name: function() {
        return this.username;
    },

    job: function() {
        userJob = UserJobs.findOne({user: this._id});
        if(userJob != null)
            return Jobs.findOne({jobId: userJob.job}).name;
        return "free week!";
    }
});


