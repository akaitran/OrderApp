/*-----Stock Controller-----*/
app.controller("devStockCtrl", function ($q, $scope, $http, $routeParams) {
  this.name = 'stockController';
  this.params = $routeParams;

  $scope.cateList = [];
  $scope.dishList = [];
  $scope.areaList = ["đồ nước", "đồ chiên", "đồ xào", "quầy bar"];

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
      $scope.context.submit = "update";
      $scope.context.title = "edit";

      $scope.thisCate = cateId;
      $scope.thisDish = {};

      $scope.cateList.filter(function(cate) {
          if (cate.id == cateId) {
              $scope.thisItem = cate;
          }
      });
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

  $scope.addDish = function () {
    var dishName = [
      { 'name': 'Heo', 'eng': 'Pork', 'cateid': 25, 'ing': 'Heo', 'cost': 16},
      { 'name': 'Bò', 'eng': 'Beef', 'cateid': 26, 'ing': 'Bò', 'cost': 16},
      { 'name': 'Gà', 'eng': 'Chicken', 'cateid': 27, 'ing': 'Gà', 'cost': 16},
      { 'name': 'Tôm', 'eng': 'Prawn', 'cateid': 28, 'ing': 'Tôm', 'cost': 18},
      { 'name': 'Mực', 'eng': 'Squid', 'cateid': 29, 'ing': 'Mực', 'cost': 17},
      { 'name': 'Cá', 'eng': 'Fish', 'cateid': 30, 'ing': 'Cá', 'cost': 17},
      { 'name': 'Điệp', 'eng': 'Scallop', 'cateid': 31, 'ing': 'Điệp', 'cost': 17},
      { 'name': 'TCẩm', 'eng': 'Combination', 'ing': 'Heo, Bò, Gà, Tôm, Cá, Mực, Điệp', 'cateid': 32, 'cost': 17}
    ];

    for (let dish of dishName) {

      $scope.thisDish = $scope.thisItem;

      $scope.thisDish.name = $scope.thisDish.name.replace("*", dish.name);
      $scope.thisDish.subname = $scope.thisDish.subname.replace("*", dish.name);
      $scope.thisDish.cateid = dish.cateid;
      $scope.thisDish.description = $scope.thisDish.description.replace("*", dish.eng);
      $scope.thisDish.ingredient = $scope.thisDish.ingredient.replace("*", dish.ing);

      console.log($scope.thisDish);

      $scope.create(dish.cost).then(function() {

      });
    }
  }

  /*  APIs Functions  */
  $scope.create = function(cost) {
    var deferred = $q.defer();

      if ($scope.thisDish.type === "category") {
          $http({
              url: "api/dishAPIs/create-category.php",
              method: "POST",
              data: {
                  data: $scope.thisDish
              }
          }).then(function(response) {
              //$scope.loadData();
          });
      } else if ($scope.thisDish.type === "dish") {
          $scope.thisDish.price = '{"M": ' +cost+',"S": 0, "L": 0}';
          $scope.thisDish.size = -3;

          $http({
              url: "api/dishAPIs/create-dish.php",
              method: "POST",
              data: {
                  data: $scope.thisDish
              }
          }).then(function(response) {
              console.log($scope.thisDish);

              deferred.resolve(123);

              //$scope.loadData();
          });
      }

      return deferred.promise;
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