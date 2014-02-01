/*#######################################################################
  
  Dan Wahlin
  http://twitter.com/DanWahlin
  http://weblogs.asp.net/dwahlin
  http://pluralsight.com/training/Authors/Details/dan-wahlin

  Normally like the break AngularJS controllers into separate files.
  Kept them together here since they're small and it's easier to look through them.
  example. 

  #######################################################################*/


//This controller retrieves data from the customersService and associates it with the $scope
//The $scope is ultimately bound to the customers view
app.controller('CustomersController', function ($scope, $http) {
    //I like to have an init() for controllers that need to perform some initialization. Keeps things in
    //one place...not required though especially in the simple example below
    $scope.customers = [];
    init();

    function init() {
        $http.get('/api/customers')
            .success(function (data) {
                $scope.customers = data;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        // $scope.customers = customersService.getCustomers();
        // console.log('second' + $scope.customers);
    }

    $scope.insertCustomer = function () {
        var firstName = $scope.newCustomer.firstName;
        var lastName = $scope.newCustomer.lastName;
        var city = $scope.newCustomer.city;
        var customer = {'firstName': firstName, 'lastName':lastName, 'city': city};

        $http.post('/api/customers', customer)
            .success(function (data) {
                $scope.customers = data;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        // customersService.insertCustomer(firstName, lastName, city);
        $scope.newCustomer.firstName = '';
        $scope.newCustomer.lastName = '';
        $scope.newCustomer.city = '';
    };

    $scope.deleteCustomer = function (id) {
        $http.delete('/api/customers/' + id)
            .success(function (data) {
                $scope.customers = data;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        // customersService.deleteCustomer(id);
    };
});

//This controller retrieves data from the customersService and associates it with the $scope
//The $scope is bound to the order view
app.controller('CustomerOrdersController', function ($scope, $http, $routeParams) {
    $scope.customer = [];
    $scope.ordersTotal = 0.00;
    
    var customerID = $routeParams.customerID;
    $http.get('/api/customers/' + customerID)
        .success(function (data) {
            $scope.customer = data;
            if ($scope.customer && $scope.customer.orders) {
                var total = 0.00;
                for (var i = 0; i < $scope.customer.orders.length; i++) {
                    var order = $scope.customer.orders[i];
                    total += order.orderTotal;
                }
                $scope.ordersTotal = total;
            }    
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    $scope.insertOrder = function () {
        console.log("running");
        var product = $scope.newOrder.product;
        var price = $scope.newOrder.price;
        var quantity = $scope.newOrder.quantity;
        var orderTotal = $scope.newOrder.orderTotal;
        var order = {'product': product, 'price':price, 'quantity': quantity, 'orderTotal': orderTotal};

        $http.post('/api/customers/' + customerID + '/order/', {'order': order})
            .success(function (data) {
                $scope.customer = data;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        // customersService.insertCustomer(firstName, lastName, city);
        $scope.newOrder.product = '';
        $scope.newOrder.price = '';
        $scope.newOrder.quantity = '';
        $scope.newOrder.orderTotal = '';

    };

});

//This controller retrieves data from the customersService and associates it with the $scope
//The $scope is bound to the orders view
app.controller('OrdersController', function ($scope, $http) {
    $scope.customers = [];

    $http.get('/api/customers')
        .success(function (data) {
            $scope.customers = data;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });
});

app.controller('NavbarController', function ($scope, $location) {
    $scope.getClass = function (path) {
        if ($location.path().substr(0, path.length) == path) {
            return true
        } else {
            return false;
        }
    }
});

//This controller is a child controller that will inherit functionality from a parent
//It's used to track the orderby parameter and ordersTotal for a customer. Put it here rather than duplicating 
//setOrder and orderby across multiple controllers.
app.controller('OrderChildController', function ($scope, $http, $routeParams) {
    $scope.orderby = 'product';
    $scope.reverse = false;

    $scope.setOrder = function (orderby) {
        if (orderby === $scope.orderby) {
            $scope.reverse = !$scope.reverse;
        }
        $scope.orderby = orderby;
    };

});
