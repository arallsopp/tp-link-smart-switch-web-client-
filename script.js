var app = angular.module('myApp', ['ngMaterial','ngCookies']);

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('custom').primaryPalette('blue-grey').accentPalette('deep-orange');
});

app.controller('dash', function ($scope, $mdToast, $http, $interval, $sce, $cookies) {

    $scope.getUUID = function(){
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
    };

    $scope.showToast = function (msg) {
        $mdToast.show($mdToast.simple().textContent(msg).position('top right'))
    };

    $scope.authenticate = function(){
        $scope.UUID=$scope.getUUID();

        var auth_obj = {
            "method": "login", "params": {
                "appType": "Kasa_Android",
                "cloudUserName": $scope.username,
                "cloudPassword": $scope.password,
                "terminalUUID": $scope.UUID
            }
        };

        $http.post("https://wap.tplinkcloud.com/",auth_obj)
        .then(function mySuccess(response) {
            $scope.token = response.data.result.token;

            $cookies.put('uuid',$scope.UUID);
            $cookies.put('username',$scope.username);
            $cookies.put('password',$scope.password);
            $cookies.put('token',$scope.token);

        }, function myError(response) {
            $scope.myWelcome = response.statusText;
        });
    };

    $scope.getDevices = function() {
        var request_obj = {"method":"getDeviceList"};

        $http.post("https://wap.tplinkcloud.com?token=" + $scope.token,request_obj)
            .then(function mySuccess(response) {
                $scope.devices = (response.data.result.deviceList);
                console.log($scope.devices);
            });

    }

    $scope.UUID = $cookies.get('uuid');
    $scope.username = $cookies.get('username');
    $scope.password = $cookies.get('password');
    $scope.token = $cookies.get('token') | '';
    $scope.devices = [];

});
