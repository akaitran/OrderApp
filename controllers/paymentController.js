/*-----Payment Controller-----*/
app.controller("paymentController", function ($scope, $http, $routeParams) {
	this.name = 'paymentController';
	this.params = $routeParams;
	$scope.testMode = localStorage.getItem("testMode");

	$scope.cateList = [];
	$scope.orderList = [];
	$scope.orderInitial = [];

	$scope.thisCate = null;
	$scope.thisService = null;
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

	$scope.sortNumber = function (item) {
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

			$scope.thisService = "dine in";
			$scope.orderInitial = angular.copy($scope.orderList);
		});
	}

	/*  Essential Functions  */
	$scope.changeOrderStatus = function (status) {
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
			if (response.data === "failed") {
				$.notify({
					message: "Network error, Please update again"
				}, {
					type: 'warning',
					timer: 2000,
					delay: 100,
					z_index: 10001,
				});
			} else {
				$.notify({
					message: "Order is already updated!"
				}, {
					timer: 2000,
					delay: 100,
					z_index: 10001,
				});

				$scope.loadData();
			}
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
	}

	$scope.selectService = function (service) {
		$scope.thisService = service;
	}

	$scope.selectOrder = function (order) {
		$scope.thisOrder = order;
	}

	$scope.orderFilter = function (item) {
		if ($scope.thisSetting.orderStatus !== "all") {
			if (item.status === $scope.thisSetting.orderStatus) {
				if (item.type === $scope.thisService) {
					return true;
				}
			} else {
				return false;
			}
		} else {
			if (item.type === $scope.thisService) {
				return true;
			}
		}
	}

	$scope.newOrder = function () {
		$scope.thisOrder = {};

		$scope.customerName = localStorage.getItem("customer");
		$scope.deliveryAddress = localStorage.getItem("address");
		$scope.phoneNumber = localStorage.getItem("phone");

		$scope.thisOrder.staffname = $scope.customerName + ' - ' + $scope.phoneNumber + ' - ' + $scope.deliveryAddress;
		$scope.thisOrder.type = "dine in";
		$scope.thisOrder.total = 0;
		$scope.thisOrder.dishes = [];
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
				if (item.cateid == $scope.thisCate.id) {
					return true;
				}
			} else {
				if (item.name.toLowerCase().indexOf($scope.searchText.toLowerCase()) !== -1) {
					return true;
				}
			}
		}
	}

	$scope.extraDish = function () {
		$('#menuModal').modal("show");

		$http({
			url: "api/dishAPIs/load-category.php",
			method: "POST"
		}).then(function (response) {
			$scope.cateList = response.data;
			$scope.thisCate = $scope.cateList[0];

			$http({
				url: "api/dishAPIs/load-ingredient.php",
				method: "POST"
			}).then(function (response) {
				$scope.ingList = response.data.filter(function (ing) {
					ing.price = parseFloat(ing.price);

					return ing;
				});

				$http({
					url: "api/dishAPIs/load-dish.php",
					method: "POST"
				}).then(function (response) {
					$scope.dishList = response.data.filter(function (dish) {
						var ingList = [];
						var optList = [];

						dish.price = JSON.parse(dish.price);

						for (var key in dish.price) {
							if (key !== 'M')
								dish.price[key] *= -1;
						}

						dish.ingredient = dish.ingredient.split(", ");

						dish.ingredient.filter(function (dishIng) {
							var lowIng = dishIng.toLowerCase();

							var getIng = $scope.ingList.filter(function (ing) {
								return lowIng === ing.name.toLowerCase();
							});

							if (getIng[0]) ingList.push({
								"name": dishIng,
								"amount": 1,
								"price": getIng[0].price,
								"unit": getIng[0].unit
							});
						});

						dish.ingredient = ingList;

						dish.options = dish.options.split(", ");

						if (dish.options[0] !== "") {
							dish.options.filter(function (opt) {
								optList.push({
									"name": opt,
									"selected": -1
								});
							});
						}

						dish.options = optList;

						return dish;
					});

					$scope.dishInitial = angular.copy($scope.dishList);
				});
			});
		});
	}

	$scope.selectDish = function (dish, status) {
		var element = document.getElementById("navigation-custom");
		element.style.top = "50%";

		element = document.getElementById("top-cover");
		element.style.visibility = "visible";

		$scope.thisDish = dish;
		$scope.thisDish.status = status;

		if (status === "new")
			$scope.thisDish.amount = 1;
	}

	$scope.closeCustom = function () {
		var element = document.getElementById("navigation-custom");
		element.style.top = "100%";

		element = document.getElementById("top-cover");
		element.style.visibility = "hidden";

		var dishIndex = -1;

		if ($scope.thisDish.status === "new") {
			$scope.thisDish.size = {
				"S": 0,
				"M": 0,
				"L": 0
			};

			console.log($scope.thisOrder);

			$scope.thisOrder.dishes.filter(function (orderDish, index) {
				if ($scope.thisDish.name === orderDish.name) {
					$scope.thisDish.ingredient.filter(function (ing) {
						delete ing.$$hashKey;
					});
					orderDish.ingredient.filter(function (ing) {
						delete ing.$$hashKey;
					});
					$scope.thisDish.options.filter(function (opt) {
						delete opt.$$hashKey;
					});
					orderDish.options.filter(function (opt) {
						delete opt.$$hashKey;
					});

					if ($scope.thisDish.type === orderDish.type &&
						JSON.stringify($scope.thisDish.ingredient) === JSON.stringify(orderDish.ingredient) &&
						JSON.stringify($scope.thisDish.options) === JSON.stringify(orderDish.options)) {

						orderDish.amount += $scope.thisDish.amount;
						$scope.thisDish.size[$scope.sizeOf($scope.thisDish)] += $scope.thisDish.amount;
						$scope.thisDish.cost = $scope.thisDish.price[$scope.sizeOf($scope.thisDish)] * $scope.thisDish.amount;

						dishIndex = index;

						$scope.thisDish.ingredient.filter(function (ing) {
							if (ing.amount > 1)
								$scope.thisDish.cost += (ing.amount - 1) * ing.price;
						});

						$scope.thisOrder.total += $scope.thisDish.cost;
						orderDish.cost += $scope.thisDish.cost;

						orderDish.size["S"] += $scope.thisDish.size["S"];
						orderDish.size["M"] += $scope.thisDish.size["M"];
						orderDish.size["L"] += $scope.thisDish.size["L"];
					}
				}
			});

			if (dishIndex == -1) {
				$scope.thisDish.size[$scope.sizeOf($scope.thisDish)] += $scope.thisDish.amount;

				$scope.thisDish.cost = $scope.thisDish.price[$scope.sizeOf($scope.thisDish)] * $scope.thisDish.amount;

				$scope.thisDish.ingredient.filter(function (ing) {
					if (ing.amount > 1)
						$scope.thisDish.cost += (ing.amount - 1) * ing.price;
				});

				$scope.thisOrder.total += $scope.thisDish.cost;

				var sizes = "";

				if ($scope.thisDish.size["S"] > 0) {
					if ($scope.thisDish.size["M"] == 0 && $scope.thisDish.size["L"] == 0)
						sizes = "S";
					else
						sizes += $scope.thisDish.size["S"] + "S";
				}

				if ($scope.thisDish.size["L"] > 0) {
					if ($scope.thisDish.size["S"] > 0)
						sizes += ",";

					if ($scope.thisDish.size["M"] == 0 && $scope.thisDish.size["S"] == 0)
						sizes = "L";
					else
						sizes += $scope.thisDish.size["L"] + "L";
				}

				if ($scope.thisDish.size["S"] == 0 && $scope.thisDish.size["L"] == 0)
					$scope.thisDish.size = sizes;
				else
					$scope.thisDish.size = "(" + sizes + ")";

				$scope.thisOrder.dishes.push($scope.thisDish);
			}
		} else {
			$scope.thisOrder.total -= $scope.thisDish.cost;

			$scope.thisDish.cost = $scope.thisDish.price[$scope.sizeOf($scope.thisDish)] * $scope.thisDish.amount;

			$scope.thisDish.ingredient.filter(function (ing) {
				if (ing.amount > 1)
					$scope.thisDish.cost += (ing.amount - 1) * ing.price;
			});

			$scope.thisOrder.total += $scope.thisDish.cost;
		}

		$scope.dishList = angular.copy($scope.dishInitial);
	}

	/*  APIs Functions  */
	$scope.delete = function () {
		$http({
			url: "api/orderAPIs/delete-order.php",
			method: "POST",
			data: {
				data: $scope.thisOrder
			}
		}).then(function (response) {
			if (response.data === "failed") {
				$.notify({
					message: "Network error, Please delete again"
				}, {
					type: 'warning',
					timer: 2000,
					delay: 100,
					z_index: 10001,
				});
			} else {
				$.notify({
					message: "Order is already deleted!"
				}, {
					type: 'success',
					timer: 2000,
					delay: 100,
					z_index: 10001,
				});

				$scope.loadData();
			}
		});
	}

	$scope.sendCounter = function () {
		$scope.sendDish = angular.copy($scope.thisOrder);

		$scope.sendDish.addition = -1;

		$http({
			url: "api/printAPIs/print-drink-usb.php",
			method: "POST",
			data: {
				data: $scope.sendDish
			}
		}).then(function (response) {
			if (response.data !== "success") {
				$.notify({
					message: response.data
				}, {
					type: 'warning',
					timer: 2000,
					delay: 100,
					z_index: 10001,
				});
			} else {
				$.notify({
					message: "Order is already sent to counter!"
				}, {
					type: 'success',
					timer: 2000,
					delay: 100,
					z_index: 10001,
				});
			}
		});
	}

	$scope.splitBill = function () {
		$scope.sendDish = angular.copy($scope.thisOrder);

		$scope.sendDish.addition = -1;

		$http({
			url: "api/printAPIs/print-split-network.php",
			method: "POST",
			data: {
				data: $scope.sendDish
			}
		}).then(function (response) {
			if (response.data === "failed") {
				$.notify({
					message: "Network error, Please wait and send again"
				}, {
					type: 'warning',
					timer: 2000,
					delay: 100,
					z_index: 10001,
				});
			} else {
				$.notify({
					message: "Order is already sent to counter!"
				}, {
					type: 'success',
					timer: 2000,
					delay: 100,
					z_index: 10001,
				});
			}
		});
	}

	$scope.splitBillEnglish = function () {
		$scope.sendDish = angular.copy($scope.thisOrder);

		$scope.sendDish.addition = -1;

		$http({
			url: "api/printAPIs/print-split-english-network.php",
			method: "POST",
			data: {
				data: $scope.sendDish
			}
		}).then(function (response) {
			if (response.data === "failed") {
				$.notify({
					message: "Network error, Please wait and send again"
				}, {
					type: 'warning',
					timer: 2000,
					delay: 100,
					z_index: 10001,
				});
			} else {
				$.notify({
					message: "Order is already sent to counter!"
				}, {
					type: 'success',
					timer: 2000,
					delay: 100,
					z_index: 10001,
				});
			}
		});
	}

	$scope.sendOrder = function () {
		$scope.sendDish = angular.copy($scope.thisOrder);

		$http({
			url: "api/printAPIs/print-drink-usb.php",
			method: "POST",
			data: {
				data: $scope.sendDish
			}
		}).then(function (response) {
			$http({
				url: "api/printAPIs/print-kitchen-network.php",
				method: "POST",
				data: {
					data: $scope.sendDish
				}
			}).then(function (response) {
				if (response.data === "failed") {
					$.notify({
						message: "Network error, Please wait and send again"
					}, {
						type: 'warning',
						timer: 2000,
						delay: 100,
						z_index: 10001,
					});
				} else {
					$.notify({
						message: "Order is already sent!"
					}, {
						type: 'success',
						timer: 2000,
						delay: 100,
						z_index: 10001,
					});
				}
			});
		});

	}

	$scope.printBill = function () {
		$scope.changeOrderStatus('finish');
		$scope.sendBill = angular.copy($scope.thisOrder);

		$http({
			url: "api/printAPIs/print-counter-usb.php",
			method: "POST",
			data: {
				data: $scope.sendBill
			}
		}).then(function (response) {
			if (response.data === "failed") {
				$.notify({
					message: "Network error, Please print again"
				}, {
					type: 'warning',
					timer: 2000,
					delay: 100,
					z_index: 10001,
				});
			} else {
				$.notify({
					message: "Bill is already printed!"
				}, {
					type: 'success',
					timer: 2000,
					delay: 100,
					z_index: 10001,
				});
			}
		});
	}
});
