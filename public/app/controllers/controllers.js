/*#######################################################################
  
  Dan Wahlin
  http://twitter.com/DanWahlin
  http://weblogs.asp.net/dwahlin
  http://pluralsight.com/training/Authors/Details/dan-wahlin

  Normally like the break AngularJS controllers into separate files.
  Kept them together here since they're small and it's easier to look through them.
  example. 

  #######################################################################*/


//This controller retrieves data from the membersService and associates it with the $scope
//The $scope is ultimately bound to the members view
app.controller('CustomersController', function ($scope, $http) {
    //I like to have an init() for controllers that need to perform some initialization. Keeps things in
    //one place...not required though especially in the simple example below
    $scope.members = [];
    init();

    function init() {
        $http.get('/api/members')
            .success(function (data) {
                $scope.members = data;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        // $scope.members = membersService.getCustomers();
        // console.log('second' + $scope.members);
    }

    $scope.insertCustomer = function () {
        var firstName = $scope.newCustomer.firstName;
        var lastName = $scope.newCustomer.lastName;
        var city = $scope.newCustomer.city;
        var member = {'firstName': firstName, 'lastName':lastName, 'city': city};

        $http.post('/api/members', member)
            .success(function (data) {
                $scope.members = data;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        // membersService.insertCustomer(firstName, lastName, city);
        $scope.newCustomer.firstName = '';
        $scope.newCustomer.lastName = '';
        $scope.newCustomer.city = '';
    };

    $scope.deleteCustomer = function (id) {
        $http.delete('/api/members/' + id)
            .success(function (data) {
                $scope.members = data;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        // membersService.deleteCustomer(id);
    };
});

//This controller retrieves data from the membersService and associates it with the $scope
//The $scope is bound to the course view
app.controller('CustomerCoursesController', function ($scope, $http, $routeParams) {
    $scope.member = [];
    $scope.coursesTotal = 0.00;
    
    var memberID = $routeParams.memberID;
    $http.get('/api/members/' + memberID)
        .success(function (data) {
            $scope.member = data;
            if ($scope.member && $scope.member.courses) {
                var total = 0.00;
                for (var i = 0; i < $scope.member.courses.length; i++) {
                    var course = $scope.member.courses[i];
                    total += course.courseTotal;
                }
                $scope.coursesTotal = total;
            }    
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    $scope.insertCourse = function () {
        console.log("running");
        var product = $scope.newCourse.product;
        var price = $scope.newCourse.price;
        var quantity = $scope.newCourse.quantity;
        var courseTotal = $scope.newCourse.courseTotal;
        var course = {'product': product, 'price':price, 'quantity': quantity, 'courseTotal': courseTotal};

        $http.post('/api/members/' + memberID + '/course/', {'course': course})
            .success(function (data) {
                $scope.member = data;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        // membersService.insertCustomer(firstName, lastName, city);
        $scope.newCourse.product = '';
        $scope.newCourse.price = '';
        $scope.newCourse.quantity = '';
        $scope.newCourse.courseTotal = '';

    };

});

//This controller retrieves data from the membersService and associates it with the $scope
//The $scope is bound to the courses view
app.controller('CoursesController', function ($scope, $http) {
    $scope.members = [];

    $http.get('/api/members')
        .success(function (data) {
            $scope.members = data;
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
//It's used to track the courseby parameter and coursesTotal for a member. Put it here rather than duplicating
//setCourse and courseby across multiple controllers.
app.controller('CourseChildController', function ($scope, $http, $routeParams) {
    $scope.courseby = 'product';
    $scope.reverse = false;

    $scope.setCourse = function (courseby) {
        if (courseby === $scope.courseby) {
            $scope.reverse = !$scope.reverse;
        }
        $scope.courseby = courseby;
    };

});
