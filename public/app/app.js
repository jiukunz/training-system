/// <reference path="../Scripts/angular-1.1.4.js" />

/*#######################################################################
  
  Dan Wahlin
  http://twitter.com/DanWahlin
  http://weblogs.asp.net/dwahlin
  http://pluralsight.com/training/Authors/Details/dan-wahlin

  Normally like to break AngularJS apps into the following folder structure
  at a minimum:

  /app
      /controllers      
      /directives
      /services
      /partials
      /views

  #######################################################################*/

var app = angular.module('membersApp', []);

//This configures the routes and associates each route with a view and a controller
app.config(function ($routeProvider) {
    $routeProvider
        .when('/members',
            {
                controller: 'CustomersController',
                templateUrl: '/app/partials/members.html'
            })
        //Define a route that has a route parameter in it (:memberID)
        .when('/membercourses/:memberID',
            {
                controller: 'CustomerCoursesController',
                templateUrl: '/app/partials/memberCourses.html'
            })
        //Define a route that has a route parameter in it (:memberID)
        .when('/courses',
            {
                controller: 'CoursesController',
                templateUrl: '/app/partials/courses.html'
            })
        .otherwise({ redirectTo: '/members' });
});




