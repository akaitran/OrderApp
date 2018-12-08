'use strict';

var app = angular.module('app', ['ngRoute','ngAnimate','ngAria','ngMaterial','material.components.keyboard','iosDblclick','ngTouch'])
.config(['$routeProvider', '$locationProvider', '$mdKeyboardProvider', function($routeProvider, $locationProvider, $mdKeyboardProvider) {
  $routeProvider
    .when('/', {
        templateUrl: 'templates/sale.html',
        controller: 'saleController'
    })
    .when('/stock', {
        templateUrl: 'templates/stock.html',
        controller: 'stockController'
    })
    .when('/payment', {
        templateUrl: 'templates/payment.html',
        controller: 'paymentController'
    })
    .when('/sale', {
        templateUrl: 'templates/sale.html',
        controller: 'saleController'
    })
    .when('/quicksale', {
        templateUrl: 'templates/quicksale.html',
        controller: 'saleController'
    })
    .when('/setting', {
        templateUrl: 'templates/setting.html',
        controller: 'settingController'
    })
    .otherwise({
        redirectTo: '/sale'
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

app.controller('mainController', function ($scope, $location) {
    $scope.thisUrl = $location.path().replace("/","");
    $scope.startApp = false;

    $scope.staffName = localStorage.getItem("staff");

    $scope.open = function() {
        var docelem = document.documentElement;

        if (typeof(Storage) !== undefined) {
            if ($scope.staffName === null) {
                $scope.staffName = document.getElementById("staffname").value;    
                localStorage.setItem("staff", $scope.staffName);
            }
        } else {
            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
        }

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
    }

    $scope.exit = function() {
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

    $scope.toggleNavbar = function() {
        if(lbd.misc.navbar_menu_visible == 1) {
            $('html').removeClass('nav-open');
           lbd.misc.navbar_menu_visible = 0;
            $('#bodyClick').remove();
        } else {
           var div = '<div id="bodyClick" ng-swipe-right="toggleNavbar()"></div>';
           $(div).appendTo('body').click(function() {
               $('html').removeClass('nav-open');
               lbd.misc.navbar_menu_visible = 0;
                setTimeout(function(){
                   $('#bodyClick').remove();
                }, 100);
           });
    
          $('html').addClass('nav-open');
           lbd.misc.navbar_menu_visible = 1;
        }
    }
});

app.filter('abs', function () {
    return function(val) {
      return Math.abs(val);
    }
});

app.directive('onLongPress', function($timeout) {
	return {
		restrict: 'A',
		link: function($scope, $elm, $attrs) {
			$elm.bind('touchstart', function(evt) {
				// Locally scoped variable that will keep track of the long press
				$scope.longPress = true;

				// We'll set a timeout for 600 ms for a long press
				$timeout(function() {
					if ($scope.longPress) {
						// If the touchend event hasn't fired,
						// apply the function given in on the element's on-long-press attribute
						$scope.$apply(function() {
							$scope.$eval($attrs.onLongPress)
						});
					}
				}, 700);
			});

			$elm.bind('touchend', function(evt) {
				// Prevent the onLongPress event from firing
				$scope.longPress = false;
				// If there is an on-touch-end function attached to this element, apply it
				if ($attrs.onTouchEnd) {
					$scope.$apply(function() {
						$scope.$eval($attrs.onTouchEnd)
					});
				}
			});
		}
	};
})