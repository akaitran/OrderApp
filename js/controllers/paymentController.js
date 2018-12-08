/*-----Payment Controller-----*/
app.controller("paymentController", function ($scope, $http, $routeParams) {
	this.name = 'paymentController';
	this.params = $routeParams;

	$scope.cateList = [];
	$scope.orderList = [];
	$scope.orderInitial = [];

	$scope.thisCate = null;
	$scope.thisDish = {};
	$scope.thisOrder = {};
	$scope.thisSize = {
		"S": -1,
		"M": -3,
		"L": -5
	};

	$scope.thisSetting = {
		"filter": "30mins",
		"orderStatus": "inprocess"
	};

	$scope.rangeOf = function (n) {
		var tables = [];

		for (var i = 0; i <= n; i++)
			tables.push(i);

		return tables;
	};

	$scope.sortNumber = function(item) {
		return parseInt(item.orderno);
	}

	$scope.loadData = function () {
		$scope.thisOrder = {};
		$scope.context = {
			"submit": "create",
			"title": "bill detail"
		};

		$http({
			url: "api/orderAPIs/load-order.php",
			method: "POST",
			data: {
				data: $scope.thisSetting.filter
			}
		}).then(function (response) {
			console.log(response);

			$scope.orderList = response.data.filter(function (order) {
				if (order.dishes) {
					var dishLength = order.dishes.length;
					var newString = "";

					if (order.dishes[0] === '"' && order.dishes[dishLength - 1] === '"')
						newString = order.dishes.slice(1, dishLength - 1);
					else
						newString = order.dishes;

					order.dishes = JSON.parse(newString);
				}

				return order;
			});

			$scope.thisCate = "dine in";
			$scope.orderInitial = angular.copy($scope.orderList);
		});
	}

	/*  Essential Functions  */
	$scope.changeOrderStatus = function(status) {
		$scope.thisOrder.status = status;
		$scope.sendBill = angular.copy($scope.thisOrder);

		$scope.sendBill.dishes = JSON.stringify($scope.sendBill.dishes);

			$http({
				url: "api/orderAPIs/update-order.php",
				method: "POST",
				data: {
					data: $scope.sendBill
				}
			}).then(function (response) {
				
			});
	}

	$scope.totalAmount = function () {
		var total = 0;

		if ($scope.thisOrder.dishes) {
			$scope.thisOrder.dishes.filter(function (dish) {
				total += dish.amount;
			});
		}

		return total;
	}

	$scope.totalCost = function () {
		var total = 0;

		if ($scope.thisOrder.dishes) {
			$scope.thisOrder.dishes.filter(function (dish) {
				total += dish.cost;
			});
		}

		$scope.thisOrder.total = total;

		return $scope.thisOrder.total;
	}

	$scope.calDishCost = function (index) {
		var cost = 0;

		cost += Math.abs($scope.thisOrder.dishes[index].price['L']) * $scope.thisOrder.dishes[index].size['L'];
		cost += Math.abs($scope.thisOrder.dishes[index].price['S']) * $scope.thisOrder.dishes[index].size['S'];
		cost += Math.abs($scope.thisOrder.dishes[index].price['M']) * ($scope.thisOrder.dishes[index].amount - $scope.thisOrder.dishes[index].size['L'] - $scope.thisOrder.dishes[index].size['S']);

		$scope.thisOrder.dishes[index].cost = cost;
	}

	$scope.sizeOf = function (dish) {
		for (var key in dish.price) {
			if (dish.price[key] > 0)
				return key;
		}
	}

	$scope.changeType = function (type) {
		if (type === $scope.thisOrder.type)
			$scope.thisOrder.type = "dine in";
		else
			$scope.thisOrder.type = type;
	}

	$scope.changeSize = function (size) {

		for (var key in $scope.thisDish.price) {
			if (key !== size) {
				if ($scope.thisDish.price[key] > 0)
					$scope.thisDish.price[key] *= -1;
			} else {
				if ($scope.thisDish.price[key] < 0)
					$scope.thisDish.price[key] *= -1;
			}
		}
	}

	$scope.selectCate = function (cate) {
		$scope.thisCate = cate;
		$scope.thisOrder = {};
	}

	$scope.selectOrder = function (order) {
		$scope.thisOrder = order;
	}

	$scope.orderFilter = function (item) {
		if ($scope.thisSetting.orderStatus !== "all") {
				if (item.status === $scope.thisSetting.orderStatus) {
					if (item.type === $scope.thisCate) {
						return true;
					}
				} else {
					return false;
				}
		} else {
			if (item.type === $scope.thisCate) {
				return true;
			}
		}
	}

	$scope.newOrder = function () {
		$scope.thisOrder = {};

		$scope.thisOrder.staffname = localStorage.getItem("staff");
		$scope.thisOrder.type = "dine in";
		$scope.thisOrder.total = 0;
		$scope.thisOrder.dishes = [];
	}

	/*  APIs Functions  */
	$scope.delete = function () {
		console.log(JSON.stringify($scope.thisOrder));
	}

	$scope.sendOrder = function () {
		$scope.sendDish = angular.copy($scope.thisOrder);
		$scope.sendDish.dishes.filter(function (dish) {
			var sizes = "";

			if (dish.size["S"] > 0) {
				if (dish.size["M"] == 0 && dish.size["L"] == 0)
					sizes = "S";
				else
					sizes += dish.size["S"] + "S";
			}

			if (dish.size["L"] > 0) {
				if (dish.size["S"] > 0)
					sizes += ",";

				if (dish.size["M"] == 0 && dish.size["S"] == 0)
					sizes = "L";
				else
					sizes += dish.size["L"] + "L";
			}

			if (dish.size["S"] == 0 && dish.size["L"] == 0)
				dish.size = sizes;
			else
				dish.size = "(" + sizes + ")";
		});

		$http({
			url: "api/printAPIs/print-kitchen-network.php",
			method: "POST",
			data: {
				data: $scope.sendDish
			}
		}).then(function (response) {
			$scope.loadData();
		});

	}

	$scope.printBill = function () {
		$scope.sendBill = angular.copy($scope.thisOrder);

		$http({
			url: "api/printAPIs/print-counter-usb.php",
			method: "POST",
			data: {
				data: $scope.sendBill
			}
		}).then(function (response) {
			$scope.toggleNavbar();
		});

	}
});
