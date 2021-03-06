// server.js

// set up ========================
var express = require('express');
var app = express(); 								// create our app w/ express
var http = require('http');
var server = http.createServer(app);
var mongoose = require('mongoose');					// mongoose for mongodb
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash')

// configuration =================

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/members';
mongoose.connect(mongoUri); 	// connect to mongoDB database on modulus.io

app.configure(function () {
    app.set('port', process.env.PORT || 8080);
    app.use(express.static(__dirname + '/public/')); 		// set the static files location /public/img will be /img for users
    app.use(express.logger('dev')); 						// log every request to the console
    app.use(express.bodyParser()); 							// pull information from html in POST
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'keyboard cat' }));// simulate DELETE and PUT
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
});

var users = [
    { id: 1, username: 'jq', password: '846315' }
];

function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}

function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }
}

passport.use(new LocalStrategy(
    function(username, password, done) {
        process.nextTick(function () {
            findByUsername(username, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
                if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
                return done(null, user);
            })
        });
    }
));

passport.serializeUser(function(user, done) {
    console.log("serializeUser");
    console.log(user.id);
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log("deserializeUser");

    findById(id, function (err, user) {
        done(err, user);
    });
});



var memberSchema   = new Schema({
    id: String,
    name: String,
    gender: String,
    woringYear: Number,
    education: String,
    major: String,
    apartment: String,
    job:String,
    startDate: String,
    courses:[Course]
});

var Member   = mongoose.model('Member', memberSchema);

var courseSchema = new Schema({
    _id: Schema.Types.ObjectId,
    date: String,
    topic: String,
    hours: Number,
    type: String,
    instruction: String,
    score: Number
})

var Course = mongoose.model('Course', courseSchema);

/*
 var members = [
 {
 name:"冀青", gender:"女", workingYears:3, id:"RL010",education:"大学本科",major:"导游",apartment:"人力资源部",job:"培训主管",startDate:"2011-1-11",
 courses:[
 {date:"2013-9-10",topic:"服务礼仪",hours:3,type:"讲授",instruction:"内训",score:3},
 {date:"2013-10-2",topic:"服务礼仪",hours:2,type:"讲授",instruction:"内训",score:2}
 ]
 },
 {
 name:"季小哇", gender:"男", workingYears:2, id:"RL011",education:"硕士",major:"英语",apartment:"市场策划部",job:"培训主管",startDate:"2011-2-22",
 courses:[
 {date:"2013-9-10",topic:"服务礼仪",hours:3,type:"讲授",instruction:"内训",score:3},
 {date:"2013-10-2",topic:"服务礼仪",hours:2,type:"讲授",instruction:"内训",score:2}
 ]
 }
 ];
 */

/*
id: 1, firstName: 'Lee', lastName: 'Carroll', address: '1234 Anywhere St.', city: 'Phoenix',
            courses: [
                { product: 'Basket', price: 29.99, quantity: 1, courseTotal: 29.99 },
                { product: 'Yarn', price: 9.99, quantity: 1, courseTotal: 39.96 },
                { product: 'Needes', price: 5.99, quantity: 1, courseTotal: 5.99 }
            ]
            */
// routes


//var a = {"member":{
//    "name":"冀青", "gender":"女", "workingYears":3, "id":"RL010","education":"大学本科","major":"导游","apartment":"人力资源部","job":"培训主管","startDate":"2011-1-11",
//        "courses":[
//        {"date":"2013-9-10","topic":"服务礼仪","hours":3,"type":"讲授","instruction":"内训","score":3},
//        {"date":"2013-10-2","topic":"服务礼仪","hours":2,"type":"讲授","instruction":"内训","score":2}
//    ]
//}}

app.get('/api/members',ensureAuthenticated, function (req, res) {
    Member.find(function (err, members) {
        if (err)
            res.send(err)
        res.json(members);
    });
});

app.post('/api/members', ensureAuthenticated, function (req, res) {
    var member = req.body.member;
    Member.create(member, function (err, member) {
        if (err){
            res.send(err);
        }
        Member.find(function (err, members) {
            if (err)
                res.send(err)
            res.json(members);
        });
    });
});

app.post('/api/members/:memberID/course',ensureAuthenticated, function(req, res) {
    var id = req.params.memberID;
    var course = req.body.course;
    course._id = new mongoose.Types.ObjectId;
    Member.findById(id, function (err, member) {
        if (err){
            res.send(err);
        } 
        member.courses.push(course);
        member.save();
        res.json(member);
    });

});


app.delete('/api/members/:memberID/:courseID', ensureAuthenticated, function (req, res) {
    var memberId = req.params.memberID;
    var courseId = req.params.courseID;
    Member.findById(memberId, function (err, member) {
        if (err){
            res.send(err);
        }
        for(var i = 0;i<member.courses.length;i++){
            if(member.courses[i]._id == courseId ){
                member.courses.splice(i, 1);
            }
        }
        member.save();
        res.json(member);
    });
});

app.delete('/api/members/:id', ensureAuthenticated, function (req, res) {
    var id = req.params.id;
    Member.remove({
        '_id': id
    }, function (err, member) {
        if (err){
            res.send(err);
        }
        Member.find(function (err, members) {
            if (err)
                res.send(err)
            res.json(members);
        });
    });
});

app.get('/api/members/:id', ensureAuthenticated, function (req, res) {
    var id = req.params.id;
    Member.findById(id, function (err, member) {
        if (err){
            res.send(err);
        }
        res.json(member);
    });
});
//
app.get('/login', function(req,res){
    res.sendfile('./public/login.html');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/', ensureAuthenticated, function(req, res) {
    res.sendfile('./public/MemberManagementApp.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

// listen (start app with node server.js) ======================================
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

