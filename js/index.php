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
		<link rel="shortcut icon" type="image/png" href="images/logo.png"/>

		<!-- Animation library for notifications   -->
		<link href="css/animate.min.css" rel="stylesheet"/>
        <link href="css/bootstrap.min.css"rel="stylesheet"/>
        <link href="css/material.min.css" rel="stylesheet"/>
        <link href="css/angular-material.min.css" rel="stylesheet"/>
        <link href="css/light-bootstrap-dashboard.css" rel="stylesheet"/>

        <!--     Fonts and icons     -->
        <link href="css/font-awesome.min.css" rel="stylesheet">
        <link href="css/icon.css" rel="stylesheet">
        <link href="css/pe-icon-7-stroke.css" rel="stylesheet"/>
        <link href="css/ng-tags-input.bootstrap.css" rel="stylesheet"/>
        <link href="css/ng-tags-input.css" rel="stylesheet"/>
        <link href="css/style.css" rel="stylesheet"/>
        <link href="css/flaticon.css" type="text/css" rel="stylesheet"/>
        <link href="css/mdKeyboard.css" rel="stylesheet"/>
        
        <!--   Core JS Files   -->
        <script src="js/jquery.3.2.1.min.js"></script>
		<script src="js/bootstrap.min.js"></script>
        <script src="js/angular.min.js"></script>
        <script src="js/angular-aria.min.js"></script>
        <script src="js/angular-animate.min.js"></script>
        <script src="js/angular-material.min.js"></script>
        <script src="js/angular-route.min.js"></script>
        <script src="js/mdKeyboard.js"></script>
        <script src="js/ios-dblclick.js"></script>
        <script src="js/angular-touch.js"></script>

		<!--  Charts Plugin -->
		<script src="js/chartist.min.js"></script>

		<!--  Notifications Plugin    -->
		<script src="js/bootstrap-notify.js"></script>

		<!-- Light Bootstrap Table Core javascript and methods for Demo purpose -->
		<script src="js/light-bootstrap-dashboard.js?v=1.4.0"></script>

        <!-- Neccesary AngularJS controllers -->
        <script src="controllers/mainController.js"></script>
        <script src="controllers/stockController.js"></script>
        <script src="controllers/paymentController.js"></script>
        <script src="controllers/saleController.js"></script>
        <script src="controllers/settingController.js"></script>
	</head>
	
	<body ng-app="app" ng-controller="mainController">
        <div class="start-screen" ng-if="startApp == false">
            <img class="image-responsive" src="images/logo.png" style="height: 80px; margin-top: 160px;">
            <h1 style="color: white">Kwat OrderApp</h1>
            <input class="form-control" style="width: 240px; margin: 20px auto" use-keyboard="US International" type="text"
                ng-if="staffName === null" id="staffname" placeholder="Enter staff name" ng-cloak>
            <button type="submit" class="btn btn-danger btn-fill" ng-click="open()">Start App</button>
            <span style="position: fixed; bottom: 20px; right: 20px; color: white;">v1.3.1</span>
        </div>

		<div class="wrapper" ng-if="startApp == true" ng-view>
        </div>
	</body>
</html>
