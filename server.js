// server.js

// set up ========================
var express = require('express');
var app = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb

// configuration =================

mongoose.connect('mongodb://localhost/customers'); 	// connect to mongoDB database on modulus.io

app.configure(function () {
    app.use(express.static(__dirname + '/public/')); 		// set the static files location /public/img will be /img for users
    app.use(express.logger('dev')); 						// log every request to the console
    app.use(express.bodyParser()); 							// pull information from html in POST
    app.use(express.methodOverride()); 						// simulate DELETE and PUT
});


var Customer = mongoose.model('Customer', {
    id: Number,
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    orders:[Order]
});

var Order = mongoose.model('Order', {
    product: String,
    price: Number,
    quantity: Number,
    orderTotal: Number
})

/*
id: 1, firstName: 'Lee', lastName: 'Carroll', address: '1234 Anywhere St.', city: 'Phoenix',
            orders: [
                { product: 'Basket', price: 29.99, quantity: 1, orderTotal: 29.99 },
                { product: 'Yarn', price: 9.99, quantity: 1, orderTotal: 39.96 },
                { product: 'Needes', price: 5.99, quantity: 1, orderTotal: 5.99 }
            ]
            */
// routes

app.get('/api/customers', function (req, res) {
    Customer.find(function (err, customers) {
        if (err)
            res.send(err)
        res.json(customers);
    });
});

app.post('/api/customers', function (req, res) {
    Customer.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        city: req.body.city
    }, function (err, todo) {
        if (err){
            res.send(err);
        }            
        Customer.find(function (err, customers) {
            if (err)
                res.send(err)
            res.json(customers);
        });
    });
});

app.post('/api/customers/:customerID/order', function(req, res) {
    var id = req.params.customerID;
    var order = req.body.order;
    Customer.findById(id, function (err, customer) {
        if (err){
            res.send(err);
        } 
        customer.orders.push(order);
        customer.save();
        res.json(customer);
    });

});

app.delete('/api/customers/:id', function (req, res) {
    var id = req.params.id;
    Customer.remove({
        '_id': id
    }, function (err, customer) {
        if (err){
            res.send(err);
        }
        Customer.find(function (err, customers) {
            if (err)
                res.send(err)
            res.json(customers);
        });
    });
});

app.get('/api/customers/:id', function (req, res) {
    var id = req.params.id;
    Customer.findById(id, function (err, customer) {
        if (err){
            res.send(err);
        }
        res.json(customer);
    });
});

app.get('*', function(req, res) {
    // res.send("hello");
    res.sendfile('./public/CustomerManagementApp.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");

