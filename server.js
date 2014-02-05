// server.js

// set up ========================
var express = require('express');
var app = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb

// configuration =================

mongoose.connect('mongodb://localhost/members'); 	// connect to mongoDB database on modulus.io

app.configure(function () {
    app.use(express.static(__dirname + '/public/')); 		// set the static files location /public/img will be /img for users
    app.use(express.logger('dev')); 						// log every request to the console
    app.use(express.bodyParser()); 							// pull information from html in POST
    app.use(express.methodOverride()); 						// simulate DELETE and PUT
});


var Member = mongoose.model('Member', {
    id: String,
    name: String,
    gender: String,
    woringYear: Number,
    education: String,
    major: String,
    apartment: String,
    job:String,
    startDate: Date,
    courses:[Course]
});

var Course = mongoose.model('Course', {
    date: Date,
    topic: String,
    hours: Number,
    type: String,
    instruction: String,
    score: Number
})

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

app.get('/api/members', function (req, res) {
    Member.find(function (err, members) {
        if (err)
            res.send(err)
        res.json(members);
    });
});

app.post('/api/members', function (req, res) {
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

app.post('/api/members/:memberID/course', function(req, res) {
    var id = req.params.memberID;
    var course = req.body.course;
    Member.findById(id, function (err, member) {
        if (err){
            res.send(err);
        } 
        member.courses.push(course);
        member.save();
        res.json(member);
    });

});

app.delete('/api/members/:id', function (req, res) {
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

app.get('/api/members/:id', function (req, res) {
    var id = req.params.id;
    Member.findById(id, function (err, member) {
        if (err){
            res.send(err);
        }
        res.json(member);
    });
});
//
app.get('*', function(req, res) {
    // res.send("hello");
    res.sendfile('./public/CustomerManagementApp.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");

