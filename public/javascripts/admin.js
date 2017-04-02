var app = angular.module("KD", ['ngFileUpload', 'ui.bootstrap'])

app.controller("main", function($scope, $http) {
    $scope.delusr = function() {
        $http.post("/delete", $scope.form)
            .success(function(data) {
                console.log("success", data)
                if (data.message == "success") {
                    $scope.msg = "user deleted"
                }
                if (data.message == "error") {
                    $scope.msg = "enter a valid user"
                }
            })
            .error(function(data) {
                console.log("error ", data)
            })
    }

    $scope.addusr = function() {
        $http.post("/register", $scope.form)
            .success(function(data) {
                console.log("success ", data)
                if (data.message == "user registered") {
                    $scope.msg = "user registered"
                }
                if (data.message == 11000) {
                    $scope.msg = "User already registered"
                }
            })
            .error(function(data) {
                console.log("error ", data)
            })
    }

    $scope.addpro = function() {
        $http.post("/addproduct", $scope.form)
            .success(function(data) {
                console.log("success", data)
                if (data.message == "success") {
                    $scope.msg = "new product added"
                }
                if (data.message == "error") {
                    $scope.msg = "try again"
                }
            })
            .error(function(data) {
                console.log("error ", data)
            })
    }

    $scope.delpro = function() {
        $http.post("/delproduct", $scope.form)
            .success(function(data) {
                console.log("success ", data)
                if (data.message == "success") {
                    $scope.msg = "product deleted"
                }
                if (data.message == "error") {
                    $scope.msg = "no such product found"
                }
            })
            .error(function(data) {
                console.log("error ", data)
            })
    }

    $http.get("/products")
        .then(function(res) {
            $scope.products = res.data;
        })

    $http.get("/posts")
        .then(function(res) {
            $scope.users = res.data;
        })

})

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

    vm.submit = function(file) {
        Upload.upload({
            url: 'http://localhost:3000/addproduct',
            method: 'POST',
            data: $scope.form
        }).then(function(resp) {
            if (resp.data.error_code === 0) {
                // $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
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