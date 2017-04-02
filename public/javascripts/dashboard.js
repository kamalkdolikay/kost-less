var app = angular.module('K', ['ngFileUpload', 'ui.bootstrap'])

app.controller('MainCtrl', [
    '$scope', '$http',
    function($scope, $http) {
        $scope.test = 'Hello world!';
        $scope.sub = function() {
            $http.post('/cpost', $scope.form)
                .success(function(data) {
                    console.log("success ", data)
                    if (data.message == "success") {
                        $scope.msg = "User edited"
                    }
                })
                .error(function(data) {
                    console.log("error ", data)
                });
        }

        $scope.sub1 = function() {
            $http({
                    method: 'POST',
                    url: '/cpost',
                    data: $scope.form
                })
                .success(function(data) {
                    console.log("success ", data)
                    if (data.message == "success") {
                        $scope.msg = "User edited"
                    }
                })
                .error(function(data) {
                    console.log("error ", data)
                });
        }

        $http.get('/cpost')
            .then(function(res) {
                $scope.settings = res.data;
                $scope.form = {};
                $scope.form.email = res.data.email;
                $scope.form.first = res.data.firstname;
                $scope.form.last = res.data.lastname;
                $scope.form.address = res.data.address;
                $scope.form.city = res.data.city;
                $scope.form.country = res.data.country;
                $scope.form.postal = res.data.postalcode;
                $scope.form.about = res.data.aboutme;
            });

        $http.get("/products")
            .then(function(res) {
                $scope.prods = res.data;
            })

        $http.get("/corders")
            .then(function(res) {
                $scope.orders = res.data;
            })

        $scope.logout = function() {
            $http.get("/logout")
                .then(function(res) {
                    console.log(res)
                    window.location.href = 'http://localhost:3000/#/login2';
                })
        }

        $scope.order = function() {
            $http.post("/orders", $scope.form)
                .success(function(data) {
                    console.log("success ", data)
                    if (data.message == "success") {
                        $scope.msg = "order successfull"
                    }
                })
                .error(function(data) {
                    console.log("error ", data)
                })
        }

        $scope.from = new Date();
        $scope.from.setMonth($scope.from.getMonth() - 1);
        $scope.to = new Date();

    }
])

app.filter('startFrom', function() {
    return function(input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
});

app.controller('PageCtrl', ['$scope', 'filterFilter', '$http', function($scope, filterFilter, $http) {
    $http.get("/products")
        .then(function(res) {
            $scope.items = res.data;
            $scope.search = {};

            $scope.resetFilters = function() {
                // needs to be a function or it won't trigger a $watch
                $scope.search = {};
            };

            // pagination controls
            $scope.currentPage = 1;
            $scope.totalItems = $scope.items.length;
            $scope.entryLimit = 2; // items per page
            $scope.maxSize = 5;
            $scope.setPage = function(pageNo) {
                $scope.currentPage = pageNo;
            };
            $scope.setItemsPerPage = function(num) {
                $scope.entryLimit = num;
                $scope.currentPage = 1; //reset to first page
            }

            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);

            // $watch search to update pagination
            $scope.$watch('search', function(newVal, oldVal) {
                $scope.filtered = filterFilter($scope.items, newVal);
                $scope.totalItems = $scope.filtered.length;
                $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
                $scope.currentPage = 1;
            }, true);
        })


    // create empty search model (object) to trigger $watch on update

}]);

app.controller('MyCtrl2', ['Upload', '$window', '$scope', function(Upload, $window, $scope) {
    var vm = this;
    vm.submit = function() { //function to call on form submit
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            vm.upload(vm.file); //call upload function
        }
    }

    vm.submit = function(file) {
        Upload.upload({
            url: 'http://localhost:3000/upload',
            method: 'POST',
            data: $scope.form
        }).then(function(resp) {
            if (resp.data.error_code === 0) {
                $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                console.log(resp.config.data.file.name)
            } else {
                $window.alert('an error occured');
            }
        }, function(resp) {
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function(evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% ';
        });
    };
}]);

app.filter("dateFilter", function() {
    return function datefilter(items, from, to) {
        var result = [];
        angular.forEach(items, function(value) {
            if (Date.parse(value.date) > Date.parse(from) && Date.parse(to) > Date.parse(value.date)) {
                result.push(value);
            }
        });
        return result;
    };
});