/*-----Sale Controller-----*/
app.controller("saleController", function ($scope, $http, $routeParams) {
	this.name = 'saleController';
	this.params = $routeParams;

	$scope.currentDate = new Date();

	$scope.cateList = [];
	$scope.dishList = [];
	$scope.dishInitial = [];

	$scope.isExtraDish = false;
	$scope.thisCate = null;
	$scope.thisDish = {};
	$scope.thisOrder = {};
	$scope.thisSize = {};

	$scope.orderType = {
		"table": "off",
		"uber": "off",
		"deliveroo": "off",
		"menulog": "off",
		"takeaway": "off",
		"booking": "off",
	};

	$scope.rangeOf = function (n) {
		var tables = [];

		for (var i = 0; i <= n; i++)
			tables.push(i);

		return tables;
	};

	$(document).ready(function() {
		$('#horizontal-list, #tabContainer').mousewheel(function(e, delta) {
			this.scrollLeft -= (delta*80);
			e.preventDefault();
		});
	});

	$scope.loadData = function () {
		$scope.thisOrder = {};
		$scope.thisCate = null;
		$scope.isDetail = 1;
		$scope.isSending = false;
		$scope.sendTitle = "Send your order";
		$scope.isDisable = false;

		$scope.context = {
			"submit": "create",
			"title": "order detail"
		};

		$http({
			url: "api/settingAPIs/load-setting.php",
			method: "POST"
		}).then(function (response) {
			$scope.settingList = response.data;

			$scope.settingList.filter(function (setting) {
				if (setting.title === "table")
					$scope.orderType.table = setting.value;
				if (setting.title === "uber")
					$scope.orderType.uber = setting.value;
				if (setting.title === "deliveroo")
					$scope.orderType.deliveroo = setting.value;
				if (setting.title === "menulog")
					$scope.orderType.menulog = setting.value;
				if (setting.title === "takeaway")
					$scope.orderType.takeaway = setting.value;
				if (setting.title === "booking")
					$scope.orderType.booking = setting.value;
				if (setting.title === "printusb")
					$scope.printUSB = setting.value;
			});
		});

		$http({
			url: "api/dishAPIs/load-category.php",
			method: "POST"
		}).then(function (response) {
			$scope.cateList = response.data;

			if ($scope.thisCate === null && $scope.cateList[0])
				$scope.thisCate = $scope.cateList[0].id;

			$http({
				url: "api/dishAPIs/load-ingredient.php",
				method: "POST",
				data: {
					apikey: $scope.webapikey,
				}
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

						dish.sizes = eval(dish.sizes);
						dish.options = eval(dish.options);
						dish.ingredients = eval(dish.ingredients);

						dish.sizes.filter(function(size) {
							size.prices = [];
							dish.options.filter(function(opt) {
								if (size.prices.indexOf(opt[size.name]) == -1)
									size.prices.push(opt[size.name]);
							});
						})

						return dish;
					});

					$scope.dishInitial = angular.copy($scope.dishList);

					$scope.newOrder();
				});
			});
		});
	}

	/*  Essential Functions  */
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
			if (dish.price[key] >= 0)
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
		$scope.thisDish.sizes.filter(function(temp) {
			if (temp.name === size.name)
				temp.selected = 1;
			else
				temp.selected = -1;
		});

		$scope.thisSize = size;
	}

	$scope.changeOption = function (opt) {
		$scope.thisDish.options.filter(function(temp) {
			if (temp.name === opt.name)
				temp.selected = 1;
			else
				temp.selected = -1;
		});
	}

	$scope.updateSize = function (size, qty) {
		if (qty == 0) {
			$scope.thisDish.amount -= $scope.thisDish.size[size];
			$scope.thisDish.size[size] = 0;
		}

		$scope.thisDish.size[size] += qty;
		$scope.thisDish.amount += qty;
	}

	$scope.closeCustom = function () {
		var element = document.getElementById("navigation-custom");
		element.style.top = "100%";

		element = document.getElementById("top-cover");
		element.style.visibility = "hidden";

		var dishIndex = -1;

		if ($scope.thisDish.status === "new") {
			$scope.thisDish.sizes.filter(function(size) {
				size.amount = 0;
			});

			$scope.thisDish.ingredients.filter(function (ing) {
				if (ing.amount == -1)
					ing.amount = 0;
			});

			$scope.thisOrder.dishes.filter(function (orderDish, index) {
				if ($scope.thisDish.name === orderDish.name) {
					$scope.thisDish.ingredients.filter(function (ing) {
						delete ing.$$hashKey;
					});
					orderDish.ingredients.filter(function (ing) {
						delete ing.$$hashKey;
					});
					$scope.thisDish.options.filter(function (opt) {
						delete opt.$$hashKey;
					});
					orderDish.options.filter(function (opt) {
						delete opt.$$hashKey;
					});

					if ($scope.thisDish.type === orderDish.type &&
						JSON.stringify($scope.thisDish.ingredients) === JSON.stringify(orderDish.ingredients) &&
						JSON.stringify($scope.thisDish.options) === JSON.stringify(orderDish.options)) {

						orderDish.amount += $scope.thisDish.amount;
						
						$scope.thisDish.sizes.filter(function(size) {
							if (size.selected == 1) {
								size.amount += $scope.thisDish.amount;
								$scope.thisDish.options.filter(function (opt) {
									if (opt.selected == 1) {
										$scope.thisDish.cost = opt[size.name] * size.amount;
									}
								});
							} else {
								size.amount = 0;
							}
						})


						dishIndex = index;

						$scope.thisDish.ingredients.filter(function (ing) {
							if (ing.amount > 1)
								$scope.thisDish.cost += (ing.amount - 1) * ing.price;
						});

						if ($scope.thisDish.name.indexOf('$') != -1) {
							var extraCost = $scope.thisDish.name.indexOf('$');
							$scope.thisDish.cost += parseInt($scope.thisDish.name[extraCost + 1]);
						}

						$scope.thisOrder.total += $scope.thisDish.cost;
						orderDish.cost += $scope.thisDish.cost;

						$scope.thisDish.sizes.filter(function(size) {
							$scope.orderDish.sizes.filter(function(dishSize) {
								if (size.name === dishSize.name)
									dishSize.amount += size.amount;
							});
						});
					}
				}
			});

			if (dishIndex == -1) {
				$scope.thisDish.sizes.filter(function(size) {
					if (size.selected == 1) {
						size.amount += $scope.thisDish.amount;
					} else {
						size.amount = 0;
					}
				});

				//$scope.thisDish.cost = $scope.thisDish.price[$scope.sizeOf($scope.thisDish)] * $scope.thisDish.amount;

				$scope.thisDish.ingredients.filter(function (ing) {
					if (ing.amount > 1)
						$scope.thisDish.cost += (ing.amount - 1) * ing.price;
				});

				if ($scope.thisDish.name.indexOf('$') != -1) {
					var extraCost = $scope.thisDish.name.indexOf('$');
					$scope.thisDish.cost += parseInt($scope.thisDish.name[extraCost + 1]);
				}

				$scope.thisOrder.total += $scope.thisDish.cost;

				$scope.thisOrder.dishes.push($scope.thisDish);
			}
		} else {
			$scope.thisDish.sizes.filter(function(size) {
				if (size.selected == 1) {
					size.amount += $scope.thisDish.amount;
				} else {
					size.amount = 0;
				}
			});

			$scope.thisOrder.total -= $scope.thisDish.cost;

			$scope.thisDish.cost = $scope.thisDish.price[$scope.sizeOf($scope.thisDish)] * $scope.thisDish.amount;

			$scope.thisDish.ingredients.filter(function (ing) {
				if (ing.amount > 1)
					$scope.thisDish.cost += (ing.amount - 1) * ing.price;
			});

			if ($scope.thisDish.name.indexOf('$') != -1) {
				var extraCost = $scope.thisDish.name.indexOf('$');
				$scope.thisDish.cost += parseInt($scope.thisDish.name[extraCost + 1]);
			}

			$scope.thisOrder.total += $scope.thisDish.cost;
		}

		$scope.dishList = angular.copy($scope.dishInitial);
	}

	$scope.selectCate = function (cateId) {
		$scope.searchText = "";

		if (!isNaN(cateId)) {
			$scope.isCate = true;

			$scope.thisCate = cateId;
			$scope.thisDish = {};

			$scope.cateList.filter(function (cate) {
				if (cate.id == cateId) {
					$scope.thisItem = cate;
				}
			});
		} else {
			$scope.isCate = false;
		}
	}

	$scope.selectDish = function (dish, status) {
		var element = document.getElementById("navigation-custom");
		element.style.top = "50%";

		element = document.getElementById("top-cover");
		element.style.visibility = "visible";

		$scope.newDish = angular.copy(dish);
		$scope.thisDish = dish;

		$scope.thisDish.status = status;

		$scope.thisDish.sizes.filter(function(size) {
			size.selected = -1;
		});

		$scope.thisDish.sizes[0]['selected'] = 1;

		$scope.thisSize = $scope.thisDish.sizes[0];

		$scope.thisDish.options.filter(function(opt) {
			opt.selected = -1;
		});

		if (status === "new")
			$scope.thisDish.amount = 1;
	}

	$scope.openDetail = function () {
		$scope.searchText = '';

		if ($scope.isDetail == 1) {
			$scope.toggleNavbar();
		} else {
			$scope.isDetail *= -1;
		}
	}

	$scope.mergeOrder = function (order) {
		$scope.tempOrder = order;
		$('#tableModal').modal("hide");
		$scope.orderList = [];
		$scope.isExtraDish = true;
	}

	$scope.closeOrder = function () {
		$scope.tempOrder = {};
		$scope.orderList = [];
	}

	$scope.search = function (item) {
		if ($scope.thisCate === null) {
			if ($scope.searchText === undefined || $scope.searchText === "") {
				return false;
			} else {
				if ($scope.changeAlias(item.subname.toLowerCase()).indexOf($scope.changeAlias($scope.searchText).toLowerCase()) !== -1) {
					return true;
				}
			}
		} else {
			if ($scope.searchText === undefined || $scope.searchText === "") {
				if (item.cateid == $scope.thisCate) {
					return true;
				}
			} else {
				if ($scope.changeAlias(item.subname.toLowerCase()).indexOf($scope.changeAlias($scope.searchText).toLowerCase()) !== -1) {
					return true;
				}
			}
		}
	}

	$scope.newOrder = function () {
		$scope.tempOrder = {};
		$scope.sendBill = {};
		$scope.thisOrder = {};
		$scope.orderList = [];
		$scope.isExtraDish = false;
		$scope.isSending = false;
		$scope.isDisable = false;
		$scope.sendTitle = "Send";

		$scope.thisOrder.staffname = localStorage.getItem("staffname");
		$scope.thisOrder.type = "dine in";
		$scope.thisOrder.total = 0;
		$scope.thisOrder.addition = -1;
		$scope.thisOrder.orderno = 0;
		$scope.thisOrder.orderside = "";
		$scope.thisOrder.dishes = [];
		$scope.thisOrder.cutlery = -1;
	}

	$scope.sortNumber = function (item) {
		return parseInt(item.orderno);
	}

	$scope.orderFilter = function (item) {
		if (item.orderno == $scope.thisOrder.orderno && item.orderside === $scope.thisOrder.orderside && item.type === $scope.thisOrder.type && item.status !== "finish") {
			return true;
		} else {
			return false;
		}
	}

	$scope.extraDish = function () {
		var filter = "1hour";

		$scope.thisOrder.addition *= -1;

		if ($scope.thisOrder.addition == 1)
			$('#tableModal').modal("show");

		$http({
			url: "api/orderAPIs/load-order.php",
			method: "POST",
			data: {
				data: filter
			}
		}).then(function (response) {
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
		});
	}

	$scope.onLongPressEnd = function (index) {
		$scope.thisDish.ingredients.filter(function (ing, ind) {
			if (ind == index) {
				if ($scope.longPress) {
					ing.amount = 0;
					$scope.longPress = false;
				} else
					ing.amount += 1;
			}
		});
	}

	$scope.stopSending = function () {
		$scope.isDisable = true;
		$scope.isSending = false;
		$scope.sendTitle = "Send";
		setTimeout($scope.isDisable = false, 2000);
	}

	/*  APIs Functions  */
	$scope.sendOrder = function () {
		if ($scope.isSending) {
			$.notify({
				message: "Order is been sending, please wait a second"
			}, {
				type: "danger",
				timer: 2000,
				delay: 100,
				z_index: 10001,
			});
		} else {
			$scope.isSending = true;
			$scope.sendTitle = "Sending...";

			if ($scope.thisOrder.type !== "dine in" || $scope.thisOrder.orderno != 0) {
				$scope.sendBill = angular.copy($scope.thisOrder);
				$scope.sendBill.dishes.filter(function (dish) {
					var sizes = "";
					dish.status = "new";
				});

				if ($scope.sendBill.dishes.length > 0 || $scope.thisOrder.type === "booking") {
					$scope.$parent.loadingActivated = true;

					var sentOrder = {
						"kitchen": false,
						"counter": false
					};

					var printVia = "network";

					if ($scope.printUSB == "on")
						printVia = "usb";
					if ($scope.printUSB == "off")
						printVia = "network";

					//Send Order Counter
					$http({
						url: "api/printAPIs/print-drink-usb.php",
						method: "POST",
						data: {
							data: $scope.sendBill
						}
					}).then(function (response) {
						if (response.data !== "success") {
							$.notify({
								message: "[COUNTER] Network error, Please wait and send again"
							}, {
								type: 'warning',
								timer: 2000,
								delay: 100,
								z_index: 10001,
							});
						} else {
							$.notify({
								message: "[COUNTER] Order is already sent!"
							}, {
								timer: 2000,
								delay: 100,
								z_index: 10001,
							});

							//Send Order Kitchen
							$http({
								url: "api/printAPIs/print-kitchen-" + printVia + ".php",
								method: "POST",
								data: {
									data: $scope.sendBill
								}
							}).then(function (response) {
								if (response.data !== "success") {
									$.notify({
										message: "[KITCHEN] Network error, Please wait and send again"
									}, {
										type: 'warning',
										timer: 2000,
										delay: 100,
										z_index: 10001,
									});
								} else {
									$.notify({
										message: "[KITCHEN] Order is already sent!"
									}, {
										timer: 2000,
										delay: 100,
										z_index: 10001,
									});

									//Refresh order list
									$scope.sendBill.dishes.filter(function (dish) {
										dish.status = "sent";
									});

									if (!$scope.isExtraDish) {
										$scope.sendBill.dishes = JSON.stringify($scope.sendBill.dishes);

										$http({
											url: "api/orderAPIs/create-order.php",
											method: "POST",
											data: {
												data: $scope.sendBill
											}
										}).then(function (response) {
											if (response.data !== "success") {
												$.notify({
													message: "[SERVER ERROR] Can't create new order, try again!"
												}, {
													type: 'warning',
													timer: 2000,
													delay: 100,
													z_index: 10001,
												});
											} else {
												$scope.isSending = false;
												$scope.sendTitle = "Send";
												$scope.newOrder();
											}
										});
									} else {
										$scope.sendBill.dishes.filter(function (dish) {
											$scope.tempOrder.dishes.push(dish);
										})

										$scope.tempOrder.total += $scope.sendBill.total;
										$scope.tempOrder.dishes = JSON.stringify($scope.tempOrder.dishes);

										$http({
											url: "api/orderAPIs/update-order.php",
											method: "POST",
											data: {
												data: $scope.tempOrder
											}
										}).then(function (response) {

											$scope.$parent.loadingActivated = false;
											if (response.data !== "success") {
												$.notify({
													message: "[SERVER ERROR] Can't update order, try again!"
												}, {
													type: 'warning',
													timer: 2000,
													delay: 100,
													z_index: 10001,
												});
											} else {
												$scope.isSending = false;
												$scope.sendTitle = "Send";
												$scope.newOrder();
											}
										});
									}
								}
							});
						}
					});

					//Load Setup Busy
					$http({
						url: "api/settingAPIs/load-setting.php",
						method: "POST"
					}).then(function (response) {
						$scope.settingList = response.data;

						$scope.settingList.filter(function (setting) {
							if (setting.title === "Setup Busy")
								if (setting.value === "on")
									$.notify({
										message: "Tự SETUP nha mọi người"
									}, {
										type: 'warning',
										timer: 2000,
										delay: 100,
										z_index: 10001,
									});
						});
					});


				} else {
					$.notify({
						message: "Order is empty"
					}, {
						type: 'danger',
						timer: 2000,
						delay: 100,
						z_index: 10001,
					});

					$scope.isSending = false;
					$scope.sendTitle = "Send";
				}
			} else {
				$.notify({
					message: "Remember to ADD Table No. " + $scope.staffName
				}, {
					type: 'danger',
					timer: 2000,
					delay: 100,
					z_index: 10001,
				});
			}
		}
	}

	$scope.printBill = function () {
		$scope.sendBill = angular.copy($scope.thisOrder);
		$scope.sendBill.dishes.filter(function (dish) {
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
			url: "api/printAPIs/print-counter-usb.php",
			method: "POST",
			data: {
				data: $scope.sendBill
			}
		}).then(function (response) {
			if (response.data !== "success") {
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
	}
});
