/*-----Stock Controller-----*/
app.controller("stockController", function ($scope, $http, $routeParams) {
    this.name = 'stockController';
    this.params = $routeParams;

    $scope.cateList = [];
    $scope.dishList = [];
    $scope.ingList = [];
    $scope.areaList = ["đồ nước", "đồ chiên", "đồ xào", "quầy bar", "đặc biệt"];

    $scope.isCate = true;
    $scope.thisCate = null;
    $scope.thisDish = {};
    $scope.thisItem = {};
    $scope.thisSize = {"S": -1, "M": -3, "L": -5}
    
    $scope.loadData = function () {
        $scope.thisItem = {};
        $scope.context = {"submit": "create", "title": "new"};

        $http({
            url: "api/dishAPIs/load-category.php",
            method: "POST"
        }).then(function(response) {
            $scope.cateList = response.data;

            if ($scope.thisCate === null)
                $scope.thisCate = $scope.cateList[0].id;

            $http({
                url: "api/dishAPIs/load-dish.php",
                method: "POST"
            }).then(function(response) {
                $scope.dishList = response.data.filter(function(dish) {
                    dish.price = JSON.parse(dish.price);

                    return dish;
                });

                $http({
                    url: "api/dishAPIs/load-ingredient.php",
                    method: "POST"
                }).then(function(response) {
                    $scope.ingList = response.data.filter(function(ing) {
                        ing.price = parseFloat(ing.price);
    
                        return ing;
                    });
                });
            });
        });

        $scope.thisItem.type = "category";
    }

    /*  Essential Functions  */
    $scope.splitContent = function (content) {
        var splitContent = content.split(",");
        return splitContent;
    };

    $scope.changeSize = function(size) {
        $scope.thisSize[size] = $scope.thisSize[size] * -1;
    }

    $scope.selectCate = function(cateId) {
        if (!isNaN(cateId)) {
            $scope.isCate = true;

            $scope.context.submit = "update";
            $scope.context.title = "edit";

            $scope.thisCate = cateId;
            $scope.thisDish = {};

            $scope.cateList.filter(function(cate) {
                if (cate.id == cateId) {
                    $scope.thisItem = cate;
                }
            });
        } else {
            $scope.isCate = false;
        }
    }

    $scope.selectDish = function(dishId) {
        $scope.context.submit = "update";
        $scope.context.title = "edit";

        $scope.dishList.filter(function(dish) {
            if (dish.id == dishId) {
                $scope.thisSize = {"S": -1, "M": -3, "L": -5}

                if (dish.size == -7) {
                    $scope.thisSize["S"] = 1;
                } else if (dish.size == -3) {
                    $scope.thisSize["M"] = 3;
                } else if (dish.size == -1) {
                    $scope.thisSize["S"] = 1;
                    $scope.thisSize["M"] = 3;
                } else if (dish.size == 1) {
                    $scope.thisSize["L"] = 5;
                } else if (dish.size == 3) {
                    $scope.thisSize["S"] = 1;
                    $scope.thisSize["L"] = 5;
                } else if (dish.size == 7) {
                    $scope.thisSize["M"] = 3;
                    $scope.thisSize["L"] = 5;
                } else if (dish.size == 9) {
                    $scope.thisSize["S"] = 1;
                    $scope.thisSize["M"] = 3;
                    $scope.thisSize["L"] = 5;
                }

                $scope.thisDish = dish;
                $scope.thisItem = dish;
            }
        });
    }

    $scope.newItem = function() {
        $scope.context.submit = "create";
        $scope.context.title = "new";

        $scope.thisItem = {};
        $scope.thisItem.cateid = $scope.thisCate;
        $scope.thisItem.area = "đồ nước";
        $scope.thisSize = {"S": -1, "M": -3, "L": -5}
    }

    $scope.copyItem = function() {
        $scope.context.submit = "create";
        $scope.context.title = "new";
    }
    
    $scope.saveExtra = function() {
        $http({
            url: "api/dishAPIs/update-ingredient.php",
            method: "POST",
            data: {
                data: $scope.ingList
            }
        }).then(function(response) {
            //$scope.loadData();
        });
    }

    $scope.search = function (item) {
        if ($scope.thisCate === null) {
            if ($scope.searchText === undefined || $scope.searchText === "") {
                return false;
            } else {
                if (item.name.toLowerCase().indexOf($scope.searchText.toLowerCase()) !== -1) {
                    return true;
                }
            }
        } else {
            if ($scope.searchText === undefined || $scope.searchText === "") {
                if (item.cateid == $scope.thisCate) {
                    return true;
                }
            } else {
                if (item.name.toLowerCase().indexOf($scope.searchText.toLowerCase()) !== -1) {
                    return true;
                }
            }
        }
    }

    /*  APIs Functions  */
    $scope.create = function() {
        if ($scope.thisItem.type === "category") {
            $http({
                url: "api/dishAPIs/create-category.php",
                method: "POST",
                data: {
                    data: $scope.thisItem
                }
            }).then(function(response) {
                //$scope.loadData();
            });
        } else if ($scope.thisItem.type === "dish") {
            $scope.thisItem.size = $scope.thisSize["S"] + $scope.thisSize["M"] + $scope.thisSize["L"];

            for (var key in $scope.thisSize) {
                if ($scope.thisSize[key] < 0) {
                    $scope.thisItem.price[key] = 0;
                }
            }

            $scope.thisItem.price = JSON.stringify($scope.thisItem.price);

            $http({
                url: "api/dishAPIs/create-dish.php",
                method: "POST",
                data: {
                    data: $scope.thisItem
                }
            }).then(function(response) {
                $scope.thisItem.price = JSON.parse($scope.thisItem.price);

                console.log($scope.thisItem.price);
                //$scope.loadData();
            });
        }
    }

    $scope.update = function() {
        console.log(JSON.stringify($scope.thisItem));
        
        if ($scope.thisItem.type === "category") {
            $http({
                url: "api/dishAPIs/update-category.php",
                method: "POST",
                data: {
                    data: $scope.thisItem
                }
            }).then(function(response) {
                $scope.loadData();
            });
        } else if ($scope.thisItem.type === "dish") {
            $scope.thisItem.size = $scope.thisSize["S"] + $scope.thisSize["M"] + $scope.thisSize["L"];

            for (var key in $scope.thisSize) {
                if ($scope.thisSize[key] < 0) {
                    delete $scope.thisItem.price[key];
                }
            }
            
            $scope.thisItem.price = JSON.stringify($scope.thisItem.price);

            $http({
                url: "api/dishAPIs/update-dish.php",
                method: "POST",
                data: {
                    data: $scope.thisItem
                }
            }).then(function(response) {
                $scope.loadData();
            });
        }
    }

    $scope.delete = function() {
        console.log(JSON.stringify($scope.thisItem));

        if ($scope.thisItem.type === "category") {
            $http({
                url: "api/dishAPIs/delete-category.php",
                method: "POST",
                data: {
                    data: $scope.thisItem
                }
            }).then(function(response) {
                $scope.loadData();
            });
        } else if ($scope.thisItem.type === "dish") {
            $http({
                url: "api/dishAPIs/delete-dish.php",
                method: "POST",
                data: {
                    data: $scope.thisItem
                }
            }).then(function(response) {
                $scope.loadData();
            });
        }
    }
});
