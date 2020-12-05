<!--
    Order WebApp by KhuongTran
-->
<?php header("Cache-Control: no-cache, no-store, must-revalidate"); ?>

<script type="text/javascript">
	document.title = "Dashboard | OrderApp";
</script> 

<html>
<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
		<link rel="shortcut icon" type="image/png" href="assets/images/logo.png"/>

		<!-- Animation library for notifications   -->
		<link href="assets/css/animate.min.css" rel="stylesheet"/>
		<link href="assets/css/jquery-ui.css" rel="stylesheet"/>
        <link href="assets/css/bootstrap.min.css"rel="stylesheet"/>
        <link href="assets/css/material.min.css" rel="stylesheet"/>
        <link href="assets/css/angular-material.min.css" rel="stylesheet"/>
        <link href="assets/css/light-bootstrap-dashboard.css" rel="stylesheet"/>

        <!--     Fonts and icons     -->
        <link href="assets/css/font-awesome.min.css" rel="stylesheet">
        <link href="assets/css/icon.css" rel="stylesheet">
        <link href="assets/css/pe-icon-7-stroke.css" rel="stylesheet"/>
        <link href="assets/css/ng-tags-input.bootstrap.css" rel="stylesheet"/>
        <link href="assets/css/ng-tags-input.css" rel="stylesheet"/>
        <link href="assets/css/style.css" rel="stylesheet"/>
        <link href="assets/css/flaticon.css" type="text/css" rel="stylesheet"/>
        <link href="assets/css/mdKeyboard.css" rel="stylesheet"/>
        
        <!--   Core JS Files   -->
        <script src="assets/js/jquery.3.2.1.min.js"></script>
        <script src="assets/js/jquery-ui.js"></script>
		<script src="assets/js/bootstrap.min.js"></script>
        <script src="assets/js/angular.min.js"></script>
        <script src="assets/js/angular-aria.min.js"></script>
        <script src="assets/js/angular-animate.min.js"></script>
        <script src="assets/js/angular-material.min.js"></script>
        <script src="assets/js/angular-route.min.js"></script>
        <script src="assets/js/mdKeyboard.js"></script>
        <script src="assets/js/ios-dblclick.js"></script>
        <script src="assets/js/angular-touch.js"></script>
        <script src='assets/js/jquery.mousewheel.min.js'></script>

		<!--  Charts Plugin -->
		<script src="assets/js/chartist.min.js"></script>

		<!--  Notifications Plugin    -->
		<script src="assets/js/bootstrap-notify.js"></script>

		<!-- Light Bootstrap Table Core javascript and methods for Demo purpose -->
		<script src="assets/js/light-bootstrap-dashboard.js?v=1.4.0"></script>

		<!-- Stripe Plugin -->
        <script src="https://js.stripe.com/v3/"></script>

        <!-- Neccesary AngularJS controllers -->
        <script src="controllers/mainController.js"></script>
        <script src="controllers/stockController.js"></script>
        <script src="controllers/paymentController.js"></script>
        <script src="controllers/saleController.js"></script>
        <script src="controllers/quickSaleController.js"></script>
        <script src="controllers/settingController.js"></script>
	</head>
	
	<body ng-app="app" ng-controller="mainController">
        <div class="start-screen" ng-if="startApp == false">
            <img class="image-responsive" src="assets/images/logo.png" style="height: 80px; margin-top: 160px;">
            <h1 style="color: white">Beplink</h1>
            <h2 style="color: white">Order Management System</h2>
            <input class="form-control" style="width: 240px; margin: 20px auto" type="text"
                id="staffname" placeholder="Enter staff name" ng-cloak>
            <button type="submit" class="btn btn-danger btn-fill" ng-click="open()">Start</button>
            <span style="position: fixed; bottom: 20px; right: 20px; color: white;">v1.4.4</span>
        </div>

		<div class="wrapper" ng-if="startApp == true" ng-view>
        </div>
	</body>
</html>
