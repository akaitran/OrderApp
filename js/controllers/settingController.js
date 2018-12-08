/*-----Setting Controller-----*/
app.controller("settingController", function ($scope, $http, $routeParams) {
    this.name = 'settingController';
    this.params = $routeParams;

    $scope.settingList = 0;

    $scope.loadData = function () {
        $http({
            url: "api/settingAPIs/load-setting.php",
            method: "POST"
        }).then(function(response) {
            $scope.settingList = response.data;

            console.log($scope.settingList);
        });
    }

    $scope.update = function(setting) {
        console.log(setting);

        $http({
            url: "api/settingAPIs/update-setting.php",
            method: "POST",
            data: {
                data: setting
            }
        }).then(function(response) {
            $scope.loadData();
        });
    }
});