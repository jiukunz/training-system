//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
app.service('membersService', ['$http', function ($http) {
    
    this.getCustomers = function () {
        return members;
    };

    this.insertCustomer = function (firstName, lastName, city) {
        var topID = members.length + 1;
        members.push({
            id: topID,
            firstName: firstName,
            lastName: lastName,
            city: city
        });
    };

    this.deleteCustomer = function (id) {
        for (var i = members.length - 1; i >= 0; i--) {
            if (members[i].id === id) {
                members.splice(i, 1);
                break;
            }
        }
    };

    this.getCustomer = function (id) {
        for (var i = 0; i < members.length; i++) {
            if (members[i].id === id) {
                return members[i];
            }
        }
        return null;
    };

    // var members = [
    //     {
    //         id: 1, firstName: 'Lee', lastName: 'Carroll', address: '1234 Anywhere St.', city: 'Phoenix',
    //         courses: [
    //             { product: 'Basket', price: 29.99, quantity: 1, courseTotal: 29.99 },
    //             { product: 'Yarn', price: 9.99, quantity: 1, courseTotal: 39.96 },
    //             { product: 'Needes', price: 5.99, quantity: 1, courseTotal: 5.99 }
    //         ]
    //     },
    //     {
    //         id: 2, firstName: 'Jesse', lastName: 'Hawkins', address: '89 W. Center St.', city: 'Atlanta',
    //         courses: [
    //             { product: 'Table', price: 329.99, quantity: 1, courseTotal: 329.99 },
    //             { product: 'Chair', price: 129.99, quantity: 4, courseTotal: 519.96 },
    //             { product: 'Lamp', price: 89.99, quantity: 5, courseTotal: 449.95 },
    //         ]
    //     },
    //     {
    //         id: 3, firstName: 'Charles', lastName: 'Sutton', address: '455 7th Ave.', city: 'Quebec',
    //         courses: [
    //             { product: 'Call of Duty', price: 59.99, quantity: 1, courseTotal: 59.99 },
    //             { product: 'Controller', price: 49.99, quantity: 1, courseTotal: 49.99 },
    //             { product: 'Gears of War', price: 49.99, quantity: 1, courseTotal: 49.99 },
    //             { product: 'Lego City', price: 49.99, quantity: 1, courseTotal: 49.99 }
    //         ]
    //     },
    //     {
    //         id: 4, firstName: 'Albert', lastName: 'Einstein', address: '8966 N. Crescent Dr.', city: 'New York City',
    //         courses: [
    //             { product: 'Baseball', price: 9.99, quantity: 5, courseTotal: 49.95 },
    //             { product: 'Bat', price: 19.99, quantity: 1, courseTotal: 19.99 }
    //         ]
    //     },
    //     {
    //         id: 5, firstName: 'Sonya', lastName: 'Williams', address: '55 S. Hollywood Blvd', city: 'Los Angeles'
    //     },
    //     {
    //         id: 6, firstName: 'Victor', lastName: 'Bryan', address: '563 N. Rainier St.', city: 'Seattle',
    //         courses: [
    //             { product: 'Speakers', price: 499.99, quantity: 1, courseTotal: 499.99 },
    //             { product: 'iPod', price: 399.99, quantity: 1, courseTotal: 399.99 }
    //         ]
    //     },
    //     {
    //         id: 7, firstName: 'Lynette', lastName: 'Gonzalez', address: '25624 Main St.', city: 'Albuquerque',
    //         courses: [
    //             { product: 'Statue', price: 429.99, quantity: 1, courseTotal: 429.99 },
    //             { product: 'Picture', price: 1029.99, quantity: 1, courseTotal: 1029.99 }
    //         ]
    //     },
    //     {
    //         id: 8, firstName: 'Erick', lastName: 'Pittman', address: '33 S. Lake Blvd', city: 'Chicago',
    //         courses: [
    //             { product: 'Book: AngularJS Development', price: 39.99, quantity: 1, courseTotal: 39.99 },
    //             { product: 'Book: Basket Weaving Made Simple', price: 19.99, quantity: 1, courseTotal: 19.99 }
    //         ]
    //     },
    //     {
    //         id: 9, firstName: 'Alice', lastName: 'Price', address: '3354 Town', city: 'Cleveland',
    //         courses: [
    //             { product: 'Webcam', price: 85.99, quantity: 1, courseTotal: 85.99 },
    //             { product: 'HDMI Cable', price: 39.99, quantity: 2, courseTotal: 79.98 }
    //         ]
    //     },
    //     {
    //         id: 10, firstName: 'Gerard', lastName: 'Tucker', address: '6795 N. 53 W. Bills Dr.', city: 'Buffalo',
    //         courses: [
    //             { product: 'Fan', price: 49.99, quantity: 4, courseTotal: 199.96 },
    //             { product: 'Remote Control', price: 109.99, quantity: 1, courseTotal: 109.99 }
    //         ]
    //     },
    //     {
    //         id: 11, firstName: 'Shanika', lastName: 'Passmore', address: '459 S. International Dr.', city: 'Orlando'
    //     }
    // ];

}]);