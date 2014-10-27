
Meteor.publish("jobs", function() {
    if(this.userId) {
        return Jobs.find();
    }
    return false;
});


Meteor.publish("userJobs", function() {
    if(this.userId) {
        return UserJobs.find();
    }
    return false;
});


function renewJobs() {
    var userJobs = UserJobs.find({});

    userJobs.forEach(function(userJob) {
        if(userJob.job < 4) {
            UserJobs.update({_id:  userJob._id},{user: userJob.user, job: (userJob.job + 1)});
        } else {
            UserJobs.update({_id: userJob._id},{user:  userJob.user, job: 1});
        }
        var twitterName = TwitterNames.findOne({user: userJob.user}).twitterName;
        var job = Jobs.findOne({jobId: userJob.job}).name;
        sendNotification(twitterName, "Du bist diese Woche mit " + job + " drann!");
    });
}

function sendAllNotifications() {
    var userJobs = UserJobs.find({});

    userJobs.forEach(function(userJob) {
        var twitterName = TwitterNames.findOne({user: userJob.user}).twitterName;
        var job = Jobs.findOne({jobId: userJob.job}).name;
        sendNotification(twitterName, "Du bist diese Woche mit " + job + " dran!");
    });
}


function sendNotification(to, text) {
    Email.send({
        to: "trigger@recipe.fttt.com",
        from: "bestWgEUW@gmail.com",
        subject: "Notification for " + to,
        text: to + " " + text
    });
}

Meteor.startup(function () {
    // code to run on server at startup
    Meteor.setInterval(renewJobs, 7 *  24 * 60 * 60 * 1000);
});
