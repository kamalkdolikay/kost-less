var app = angular.module('KD', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'home.html',
                controller: 'mainCtrl'
            })

        .state('register', {
            url: '/register',
            templateUrl: 'register.html',
            controller: 'registerCtrl'
        })

        .state('login', {
            url: '/login',
            templateUrl: 'login.html',
            controller: 'loginCtrl'
        })

        .state('register2', {
            url: '/register2',
            templateUrl: 'register2.html',
            controller: 'registerCtrl'
        })

        .state('login2', {
            url: '/login2',
            templateUrl: 'login2.html',
            controller: 'loginCtrl'
        });

        //$urlRouterProvider.otherwise('home');

        //$locationProvider.html5Mode(true);
    }
]);

app.factory('CPost', ['$resource', function($resource) {
    return $resource('/cpost');
}]);

app.controller('mainCtrl', [
    '$scope',
    function($scope) {
        $scope.post = "kamal";
    }
]);

app.controller('registerCtrl', [
    '$scope',
    '$http',
    '$location',
    function($scope, $http, $location) {
        $scope.submit = function() {
            $http.post('/register', $scope.form)
                .success(function(data) {
                    console.log("success ", data);
                    if (data.message == "user registered") {
                        // $location.path('/dashboard')
                        window.location.href = 'http://localhost:3000/dashboard';
                    }
                    if (data.message == 11000) {
                        $scope.msg = "User already registered";
                    }
                    // $http({
                    //     method: 'POST',
                    //     url: '/addressBook/api/Person',
                    //     data: $scope.person,
                    //     headers: {
                    //         'Content-Type': 'application/json; charset=utf-8'
                    //     }
                    // })
                })
                .error(function(data) {
                    console.log("error ", data);
                });
        };
    }
]);

app.controller('loginCtrl', [
    '$scope',
    '$http',
    '$location',
    function($scope, $http, $location) {
        $scope.submit1 = function() {
            $http.post('/login', $scope.form)
                .success(function(data, status) {
                    console.log("success ", data);

                    if (data.message == 'Incorrect username' && data.success === false) {
                        $scope.msg = "Incorrect username";
                    } else if (data.message == 'Incorrect password' && data.success === false) {
                        $scope.msg = "Incorrect password";
                    } else if (data.success === false) {
                        $scope.msg = "Enter username or password";
                    } else if (data.type == "admin") {
                        window.location.href = 'http://localhost:3000/admin';
                    } else {
                        window.location.href = 'http://localhost:3000/dashboard';
                    }
                })
                .error(function(data) {
                    console.log("error ", data);
                });
        };
    }
]);