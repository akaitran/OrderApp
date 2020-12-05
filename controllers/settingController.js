/*-----Setting Controller-----*/
app.controller("settingController", function ($scope, $http, $routeParams) {
	this.name = 'settingController';
	this.params = $routeParams;
	$scope.testMode = localStorage.getItem("testMode");

	$scope.settingList = [];

	$scope.initial = function() {
		$scope.loadData();
		$scope.selectSetting('business');
	}

	$scope.loadData = function () {
		$http({
			url: "api/settingAPIs/load-setting.php",
			method: "POST"
		}).then(function (response) {
			$scope.settingList = response.data;
		});
	}

	$scope.updateSetting = function (setting) {
		console.log(setting);

		$http({
			url: "api/settingAPIs/update-setting.php",
			method: "POST",
			data: {
				data: setting
			}
		}).then(function (response) {
			$scope.notify("Value of " + setting.title + " has been changed!", "info");
			$scope.loadData();
		});
	}

	$scope.selectSetting = function (type) {
		$scope.thisTab = type;
	}

	$scope.updateUser = function () {
		localStorage.setItem("customerName", $scope.customerName);
		localStorage.setItem("deliveryAddress", $scope.deliveryAddress);
		localStorage.setItem("phoneNumber", $scope.phoneNumber);
		
		$scope.notify("Your user information is changed!", "info");
	}

	$scope.updateMode = function (value) {
		localStorage.setItem("testMode", value);
		$.notify({
			message: "Your mode is changed!"
		}, {
			timer: 2000,
			delay: 100,
			z_index: 10001,
		});
	}

	$scope.sendSMS = function () {
		var sms = {
			message: 'test code',
			number: '61435548187'
		};

		$http({
			url: "api/authAPIs/send-verify-code.php",
			method: "POST",
			data: {
				data: sms
			}
		}).then(function (response) {
			console.log(response);
		});
	}
});

