﻿/*#######################################################################
  
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
app.controller('MembersController', function ($scope, $http) {
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
        // $scope.members = membersService.getMembers();
        // console.log('second' + $scope.members);
    }

    /*
     {
     name:"冀青", gender:"女", workingYears:3, id:"RL010",education:"大学本科",major:"导游",apartment:"人力资源部",job:"培训主管",startDate:"2011-1-11",
     courses:[
     {date:"2013-9-10",topic:"服务礼仪",hours:3,type:"讲授",instruction:"内训",score:3},
     {date:"2013-10-2",topic:"服务礼仪",hours:2,type:"讲授",instruction:"内训",score:2}
     ]
     }
     */
    $scope.insertMember = function () {
        var name = $scope.newMember.name;
        var gender = $scope.newMember.gender;
        var workingYears = $scope.newMember.workingYears;
        var id = $scope.newMember.id;
        var education = $scope.newMember.education;
        var major = $scope.newMember.major;
        var apartment = $scope.newMember.apartment;
        var job = $scope.newMember.job;
        var startDate = $scope.newMember.startDate;
        var member = {"name":name,"gender":gender,"workingYears":workingYears,"id":id,"education":education,"major":major,"apartment":apartment,"job":job,"startDate":startDate};
        $http.post('/api/members', {'member': member})
            .success(function (data) {
                $scope.members = data;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        // membersService.insertMember(firstName, lastName, city);
        $scope.newMember.name = '';
        $scope.newMember.gender = '';
        $scope.newMember.workingYears = '';
        $scope.newMember.id = '';
        $scope.newMember.education = '';
        $scope.newMember.major = '';
        $scope.newMember.apartment = '';
        $scope.newMember.job = '';
        $scope.newMember.startDate = '';
    };

    $scope.deleteMember = function (id) {
        $http.delete('/api/members/' + id)
            .success(function (data) {
                $scope.members = data;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        // membersService.deleteMember(id);
    };
});

//This controller retrieves data from the membersService and associates it with the $scope
//The $scope is bound to the course view
app.controller('MemberCoursesController', function ($scope, $http, $routeParams) {
    $scope.member = [];

    var memberID = $routeParams.memberID;
    $http.get('/api/members/' + memberID)
        .success(function (data) {
            $scope.member = data;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    $scope.insertCourse = function () {
        var date = $scope.newCourse.date;
        var topic = $scope.newCourse.topic;
        var hours = $scope.newCourse.hours;
        var type = $scope.newCourse.type;
        var instruction = $scope.newCourse.instruction;
        var score = $scope.newCourse.score;
        var course = {'date': date, 'topic':topic, 'hours': hours, 'instruction': instruction, 'score':score, 'type':type};

        $http.post('/api/members/' + memberID + '/course/', {'course': course})
            .success(function (data) {
                console.log( $scope.member);
                $scope.member = data;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        // membersService.insertMember(firstName, lastName, city);
        $scope.newCourse.date = '';
        $scope.newCourse.topic = '';
        $scope.newCourse.hours = '';
        $scope.newCourse.type = '';
        $scope.newCourse.instruction = '';
        $scope.newCourse.score = '';
    };

    $scope.deleteCourse = function (memberID,courseID) {
        $http.delete('/api/members/' + memberID +'/' + courseID)
            .success(function (data) {
                $scope.member = data;
                console.log($scope.member);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
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
    $scope.orderby = 'topic';
    $scope.reverse = false;

    $scope.setCourse = function (orderby) {
        if (orderby === $scope.orderby) {
            $scope.reverse = !$scope.reverse;
        }
        $scope.orderby = orderby;
    };
});
