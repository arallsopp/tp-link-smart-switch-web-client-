var app = angular.module('myApp', ['ngMaterial', 'ngCookies']);

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('custom').primaryPalette('blue-grey').accentPalette('deep-orange');
});

app.controller('dash', function ($scope, $mdToast, $http, $interval, $cookies) {

    $scope.getUUID = function () {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now();
            ; //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    $scope.showToast = function (msg) {
        $mdToast.show($mdToast.simple().textContent(msg).position('top right'))
    };

    $scope.authenticate = function () {
        $scope.UUID = $scope.getUUID();

        var auth_obj = {
            "method": "login", "params": {
                "appType": "Kasa_Android",
                "cloudUserName": $scope.username,
                "cloudPassword": $scope.password,
                "terminalUUID": $scope.UUID
            }
        };

        $http.post("https://wap.tplinkcloud.com/", auth_obj).then(function mySuccess(response) {
            $scope.token = response.data.result.token;

            $cookies.put('uuid', $scope.UUID);
            if($scope.store_credentials) {
                $cookies.put('username', $scope.username);
                $cookies.put('password', $scope.password);
                $cookies.put('store_credentials',true);
            }else{
                $cookies.remove('username');
                $cookies.remove('password');
                $cookies.remove('store_credentials');
            }

            if($scope.store_token) {
                $cookies.put('token', $scope.token);
                $cookies.put('store_token',true);

            }else{
                $cookies.remove('token');
                $cookies.remove('store_token');
            }

            $scope.refreshDevices();

        }, function myError(response) {
            $scope.myWelcome = response.statusText;
        });

    };

    $scope.refreshDevices = function () {
        var request_obj = {"method": "getDeviceList"};

        $http.post("https://wap.tplinkcloud.com?token=" + $scope.token, request_obj).then(function mySuccess(response) {
            $scope.devices = (response.data.result.deviceList);
            console.log($scope.devices);

            if ($scope.devices.length) {
                $scope.selected_tab_index = 0;
            }
        });


    };

    $scope.getState = function (device_index) {
        var url = $scope.devices[device_index].appServerUrl;
        var deviceId = $scope.devices[device_index].deviceId;

        var request_obj = {
            "method": "passthrough", "params": {
                "deviceId": deviceId,
                "requestData": "{\"system\":{\"get_sysinfo\":null},\"emeter\":{\"get_realtime\":null}}"
            }
        };
        $http.post(url + "?token=" + $scope.token, request_obj).then(function mySuccess(response) {
            window.response = response;
            var testval = JSON.parse(response.data.result.responseData).system.get_sysinfo.relay_state;
            console.log(device_index, testval, response);

            $scope.devices[device_index].is_powered = (testval == true);
        });
    };

    $scope.setState = function (device_index, device_state) {
        var url = $scope.devices[device_index].appServerUrl;
        var deviceId = $scope.devices[device_index].deviceId;

        var request_obj = {
            "method": "passthrough", "params": {
                "deviceId": deviceId,
                "requestData": "{\"system\":{\"set_relay_state\":{\"state\":" + (device_state ? 1 : 0 ) + "}}}"
            }
        };
        $http.post(url + "?token=" + $scope.token, request_obj).then(function mySuccess(response) {
            window.response = response;
            console.log(response);
        });
    };

    $interval(function () {
        for (var i = 0; i < $scope.devices.length; i++) {
            $scope.getState(i);
        }
    }, 5 * 1000);

    $scope.store_token = $cookies.get('store_token') == "true";
    $scope.store_credentials = $cookies.get('store_credentials') == "true";

    $scope.UUID = $cookies.get('uuid');
    if($scope.store_credentials){
        $scope.username = $cookies.get('username');
        $scope.password = $cookies.get('password');
    }
    if($scope.store_token) {
        $scope.token = $cookies.get('token');
    }
    $scope.devices = [];
    $scope.selected_tab_index = 0;



    if (typeof ($scope.token) === "undefined") {
        $scope.token = '';
    } else {
        $scope.refreshDevices();
    }

});
