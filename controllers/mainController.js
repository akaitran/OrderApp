'use strict';

var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngAria', 'ngMaterial', 'material.components.keyboard', 'iosDblclick', 'ngTouch'])
	.config(['$routeProvider', '$locationProvider', '$mdKeyboardProvider', function ($routeProvider, $locationProvider, $mdKeyboardProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'templates/sale.html',
				controller: 'saleController'
			})
			.when('/stock', {
				templateUrl: 'templates/stock.html',
				controller: 'stockController'
			})
			.when('/order', {
				templateUrl: 'templates/payment.html',
				controller: 'paymentController'
			})
			.when('/food', {
				templateUrl: 'templates/sale.html',
				controller: 'saleController'
			})
			.when('/quicksale', {
				templateUrl: 'templates/quicksale.html',
				controller: 'quickSaleController'
			})
			.when('/setting', {
				templateUrl: 'templates/setting.html',
				controller: 'settingController'
			})
			.otherwise({
				redirectTo: '/food'
			});

		// add custom layout for numbers
		$mdKeyboardProvider.addLayout('Numbers', {
			'name': 'Numbers', 'keys': [
				[['1', 1], ['2', 2], ['3', 3]],
				[['4', 4], ['5', 5], ['6', 6]],
				[['7', 7], ['8', 8], ['9', 9]],
				[['.'], ['0', 0], ['CE', 'Bksp']]
			], 'lang': ['us']
		});

		// default layout is us
		$mdKeyboardProvider.defaultLayout('US International');
	}]);

app.service('Config', function($http) {
	return function() {
		return $http.get('.config');
	};
});

app.controller('mainController', function ($scope, $location, $http, Config) {
	$scope.thisUrl = $location.path().replace("/", "");
	$scope.startApp = false;
	$scope.testMode = localStorage.getItem("testMode");

	Config().then(function(config) {
		$scope.webapikey = config.data.API_KEY;
	});

	//var stripe = Stripe('pk_test_EV1zyOnivwReh4DN2OTDFyvh00fSJhIuNd');

	/*stripe.redirectToCheckout({
		// Make the id field from the Checkout Session creation API response
		// available to this file, so you can provide it as parameter here
		// instead of the {{CHECKOUT_SESSION_ID}} placeholder.
		sessionId: '{{CHECKOUT_SESSION_ID}}'
	  }).then(function (result) {
		// If `redirectToCheckout` fails due to a browser or network
		// error, display the localized error message to your customer
		// using `result.error.message`.
	  });*/

	$scope.staffName = localStorage.getItem("staffname");

	$scope.loadingActivated = true;

	$scope.notify = function (message, type) {
		$.notify({
			message: message
		}, {
			type: type,
			timer: 2000,
			delay: 100,
			z_index: 10001,
		});
	}

	$scope.open = function () {
		var docelem = document.documentElement;

		if (typeof (Storage) !== undefined) {
			$scope.staffName = document.getElementById("staffname").value;

			if ($scope.staffName === "") {
				$scope.notify("Please enter your Name", "warning");
			} else {
				localStorage.setItem("staffname", $scope.staffName);

				if (docelem.requestFullscreen) {
					docelem.requestFullscreen();
				} else if (docelem.mozRequestFullScreen) {
					docelem.mozRequestFullScreen();
				} else if (docelem.webkitRequestFullscreen) {
					docelem.webkitRequestFullscreen();
				} else if (docelem.msRequestFullscreen) {
					docelem.msRequestFullscreen();
				}
				$scope.startApp = true;
				$scope.notify("Welcome back " + $scope.staffName, "info");
			}
		} else {
			document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
		}
	}

	$scope.exit = function () {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}

		$scope.startApp = false;
	}

	$scope.toggleNavbar = function () {
		if (lbd.misc.navbar_menu_visible == 1) {
			$('html').removeClass('nav-open');
			lbd.misc.navbar_menu_visible = 0;
			$('#bodyClick').remove();
		} else {
			var div = '<div id="bodyClick" ng-swipe-right="toggleNavbar()"></div>';
			$(div).appendTo('body').click(function () {
				$('html').removeClass('nav-open');
				lbd.misc.navbar_menu_visible = 0;
				setTimeout(function () {
					$('#bodyClick').remove();
				}, 100);
			});

			$('html').addClass('nav-open');
			lbd.misc.navbar_menu_visible = 1;
		}
	}

	$scope.changeAlias = function (alias) {
		var str = alias;
		str = str.toLowerCase();
		str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
		str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
		str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
		str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
		str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
		str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
		str = str.replace(/đ/g, "d");
		str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
		str = str.replace(/ + /g, " ");
		str = str.replace(/\s+/g, "");
		str = str.trim();
		return str;
	}
});

app.filter('abs', function () {
	return function (val) {
		return Math.abs(val);
	}
});

app.directive('onLongPress', function ($timeout) {
	return {
		restrict: 'A',
		link: function ($scope, $elm, $attrs) {
			$elm.bind('touchstart', function (evt) {
				// Locally scoped variable that will keep track of the long press
				$scope.longPress = true;

				// We'll set a timeout for 600 ms for a long press
				$timeout(function () {
					if ($scope.longPress) {
						// If the touchend event hasn't fired,
						// apply the function given in on the element's on-long-press attribute
						$scope.$apply(function () {
							$scope.$eval($attrs.onLongPress)
						});
					}
				}, 200);
			});

			$elm.bind('touchend', function (evt) {
				// Prevent the onLongPress event from firing
				$scope.longPress = false;
				// If there is an on-touch-end function attached to this element, apply it
				if ($attrs.onTouchEnd) {
					$scope.$apply(function () {
						$scope.$eval($attrs.onTouchEnd)
					});
				}
			});
		}
	};
})

app.directive('ngTouchstart', function () {
	return function (scope, element, attr) {
		element.on('touchstart', function (event) {
			scope.$apply(function () {
				scope.$eval(attr.ngTouchstart);
			});
		});
	};
});

app.directive('ngTouchend', function () {
	return function (scope, element, attr) {

		element.on('touchend', function (event) {
			scope.$apply(function () {
				scope.$eval(attr.ngTouchend);
			});
		});
	};
});
