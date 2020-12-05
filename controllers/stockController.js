/*-----Stock Controller-----*/
app.controller("stockController", function ($scope, $http, $routeParams) {
	this.name = 'stockController';
	this.params = $routeParams;
	$scope.testMode = localStorage.getItem("testMode");

	$scope.cateList = [];
	$scope.dishList = [];
	$scope.ingList = [];
	$scope.areaList = ["kitchen", "bar"];

	$scope.isCate = true;
	$scope.thisCate = null;
	$scope.thisDish = {};
	$scope.thisItem = {
		cateid: $scope.thisCate,
		area: "kitchen",
		sizes: [],
		ingredients: [],
		options: []
	};

	$scope.thisSize = [];

	$scope.loadData = function () {
		$scope.thisItem = {
			cateid: $scope.thisCate,
			area: "kitchen",
			sizes: [],
			ingredients: [],
			options: []
		};
		$scope.context = { "submit": "create", "title": "new" };

		$http({
			url: "api/dishAPIs/load-category.php",
			method: "POST"
		}).then(function (response) {
			$scope.cateList = response.data;

			if ($scope.thisCate === null && $scope.cateList[0])
				$scope.thisCate = $scope.cateList[0].id;

			$http({
				url: "api/dishAPIs/load-dish.php",
				method: "POST"
			}).then(function (response) {
				$scope.dishList = response.data.filter(function (dish) {
					dish.sizes = eval(dish.sizes);
					dish.options = eval(dish.options);
					dish.ingredients = eval(dish.ingredients);

					return dish;
				});

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

	$scope.changeSize = function (size) {
		$scope.thisSize[size] = $scope.thisSize[size] * -1;
	}

	$scope.dragSelect = function (index) {
		console.log("select: " + index);

		var dragItem = document.querySelector("#tabItem" + index);
		dragItem.style.border = "1px solid #1DC7EA";
	}

	$scope.selectCate = function (cateId) {
		console.log("select");
		if (!isNaN(cateId)) {
			$scope.isCate = true;

			$scope.context.submit = "update";
			$scope.context.title = "edit";

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

	$scope.selectDish = function (dishId) {
		$scope.context.submit = "update";
		$scope.context.title = "edit";

		$scope.dishList.filter(function (dish) {
			if (dish.id == dishId) {
				$scope.thisDish = dish;
				$scope.thisItem = dish;
			}
		});
	}

	$scope.newItem = function () {
		$scope.context.submit = "create";
		$scope.context.title = "new";

		$scope.thisItem = {};
		$scope.thisItem.cateid = $scope.thisCate;
		$scope.thisItem.area = "kitchen";
		$scope.thisItem.sizes = [];
		$scope.thisItem.ingredients = [];
		$scope.thisItem.options = [];
	}

	$scope.copyItem = function () {
		$scope.context.submit = "create";
		$scope.context.title = "new";
	}

	$scope.saveExtra = function () {
		$http({
			url: "api/dishAPIs/update-ingredient.php",
			method: "POST",
			data: {
				data: $scope.ingList
			}
		}).then(function (response) {
			$scope.loadData();
		});
	}

	$scope.addSize = function() {
		let size = {
			name: "",
			price: 0
		}

		$scope.thisItem.sizes.push(size);
	}

	$scope.removeSize = function(index) {
		$scope.thisItem.sizes = $scope.thisItem.sizes.splice(index, 1);
	}

	$scope.addIngredient = function() {
		let ing = {
			name: "",
			price: 0
		}

		$scope.thisItem.ingredients.push(ing);
	}

	$scope.removeIngredient = function(index) {
		$scope.thisItem.ingredients = $scope.thisItem.ingredients.splice(index, 1);
	}

	$scope.addOption = function() {
		let opt = {
			name: "",
		}

		$scope.thisItem.options.push(opt);
	}

	$scope.removeOption = function(index) {
		$scope.thisItem.options = $scope.thisItem.options.splice(index, 1);
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
	$scope.create = function () {
		if ($scope.thisItem.type === "category") {
			$http({
				url: "api/dishAPIs/create-category.php",
				method: "POST",
				data: {
					data: $scope.thisItem
				}
			}).then(function (response) {
				$scope.loadData();
			});
		} else if ($scope.thisItem.type === "dish") {
			$scope.thisItem.sizes = JSON.stringify($scope.thisItem.sizes);
			$scope.thisItem.options = JSON.stringify($scope.thisItem.options);
			$scope.thisItem.ingredients = JSON.stringify($scope.thisItem.ingredients);

			$http({
				url: "api/dishAPIs/create-dish.php",
				method: "POST",
				data: {
					data: $scope.thisItem
				}
			}).then(function (response) {
				if (response.data === "failed") {
					$scope.notify("Network error, Please wait create again", "warning");
				} else {
					$scope.notify("New dish is created!", "success");
					$scope.loadData();
				}
			});
		}
	}

	$scope.update = function () {
		if ($scope.thisItem.type === "category") {
			$http({
				url: "api/dishAPIs/update-category.php",
				method: "POST",
				data: {
					data: $scope.thisItem
				}
			}).then(function (response) {
				if (response.data === "failed") {
					$scope.notify("Network error, Please wait update again","warning");
				} else {
					$scope.notify("Category is updated!","success");
					$scope.loadData();
				}
			});
		} else if ($scope.thisItem.type === "dish") {
			$scope.thisItem.sizes = JSON.stringify($scope.thisItem.sizes);
			$scope.thisItem.options = JSON.stringify($scope.thisItem.options);
			$scope.thisItem.ingredients = JSON.stringify($scope.thisItem.ingredients);

			$http({
				url: "api/dishAPIs/update-dish.php",
				method: "POST",
				data: {
					data: $scope.thisItem
				}
			}).then(function (response) {
				if (response.data === "failed") {
					$scope.notify("Network error, Please wait update again","warning");
				} else {
					$scope.notify("Dish is updated!","success");
					$scope.loadData();
				}
			});
		}
	}

	$scope.delete = function () {
		console.log(JSON.stringify($scope.thisItem));

		if ($scope.thisItem.type === "category") {
			$http({
				url: "api/dishAPIs/delete-category.php",
				method: "POST",
				data: {
					data: $scope.thisItem
				}
			}).then(function (response) {
				$scope.loadData();
			});
		} else if ($scope.thisItem.type === "dish") {
			$http({
				url: "api/dishAPIs/delete-dish.php",
				method: "POST",
				data: {
					data: $scope.thisItem
				}
			}).then(function (response) {
				if (response.data === "failed") {
					$.notify({
						message: "Network error, Please wait delete again"
					}, {
						type: 'warning',
						timer: 2000,
						delay: 100,
						z_index: 10001,
					});
				} else {
					$.notify({
						message: "Dish is already deleted!"
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
	}
});
