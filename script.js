var app = angular.module('myApp', ['ngMaterial','ngCookies']);

myDash.$inject = ['$scope', '$mdToast','$http','$interval','$cookies'];

angular.module('myApp').controller('dash', myDash)
    .config(['$mdThemingProvider',function($mdThemingProvider) {
        $mdThemingProvider.theme('custom').primaryPalette('blue-grey').accentPalette('deep-orange');
    }]);

function myDash($scope, $mdToast, $http, $interval, $cookies) {

    $scope.getUUID = function () {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now();
            //use high-precision timer if available
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

    $scope.tpl_authenticate = function () {
        $scope.tpl.UUID = $scope.getUUID();

        var auth_obj = {
            "method": "login", "params": {
                "appType": "Kasa_Android",
                "cloudUserName": $scope.tpl.username,
                "cloudPassword": $scope.tpl.password,
                "terminalUUID": $scope.tpl.UUID
            }
        };

        $http.post("https://wap.tplinkcloud.com/", auth_obj).then(function mySuccess(response) {
            var now = new Date();
            var exp = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());

            $scope.tpl.token = response.data.result.token;

            $cookies.put('tpl_uuid', $scope.tpl.UUID,{expires: exp});
            if($scope.tpl.store_credentials) {
                $cookies.put('tpl_username', $scope.tpl.username,{ expires: exp});
                $cookies.put('tpl_password', $scope.tpl.password,{ expires: exp});
                $cookies.put('tpl_store_credentials',true,{ expires: exp});

            }else{
                $cookies.remove('tpl_username');
                $cookies.remove('tpl_password');
                $cookies.remove('tpl_store_credentials');
            }

            if($scope.tpl.store_token) {
                $cookies.put('tpl_token', $scope.tpl.token,{ expires: exp});
                $cookies.put('tpl_store_token',true,{ expires: exp});

            }else{
                $cookies.remove('tpl_token');
                $cookies.remove('tpl_store_token');
            }

            $scope.tpl_refreshDevices();

        }, function myError(response) {
            $scope.myWelcome = response.statusText;
        });

    };

    $scope.tpl_refreshDevices = function () {
        var request_obj = {"method": "getDeviceList"};

        $http.post("https://wap.tplinkcloud.com?token=" + $scope.tpl.token, request_obj).then(function mySuccess(response) {
            $scope.tpl.devices = (response.data.result.deviceList);
            console.log($scope.tpl.devices);
            if ($scope.tpl.devices.length) {
                for (var i = 0; i < $scope.tpl.devices.length; i++) {
                    $scope.tpl_getState(i);
                }

                $scope.selected_tab_index = 0;
            }
        });


    };

    $scope.tpl_getState = function (device_index) {
        var url = $scope.tpl.devices[device_index].appServerUrl;
        var deviceId = $scope.tpl.devices[device_index].deviceId;

        var request_obj = {
            "method": "passthrough", "params": {
                "deviceId": deviceId,
                "requestData": "{\"system\":{\"get_sysinfo\":null},\"emeter\":{\"get_realtime\":null}}"
            }
        };
        $http.post(url + "?token=" + $scope.tpl.token, request_obj).then(function mySuccess(response) {
            window.response = response;
            var testval = JSON.parse(response.data.result.responseData).system.get_sysinfo.relay_state;
            console.log(device_index, testval, response);

            $scope.tpl.devices[device_index].is_powered = (testval == true);
        });
    };

    $scope.tpl_setState = function (device_index, device_state) {
        var url = $scope.tpl.devices[device_index].appServerUrl;
        var deviceId = $scope.tpl.devices[device_index].deviceId;

        var request_obj = {
            "method": "passthrough", "params": {
                "deviceId": deviceId,
                "requestData": "{\"system\":{\"set_relay_state\":{\"state\":" + (device_state ? 1 : 0 ) + "}}}"
            }
        };
        $http.post(url + "?token=" + $scope.tpl.token, request_obj).then(function mySuccess(response) {
            window.response = response;
            console.log(response);
        });
    };

    $scope.tpl = {};
    $scope.tpl.refresh_rate = 5; //check every 5 seconds. Set this as you fancy.

    $scope.tpl.devices = [];
    $scope.tpl.store_token = $cookies.get('tpl_store_token') == "true";
    $scope.tpl.store_credentials = $cookies.get('tpl_store_credentials') == "true";
    $scope.tpl.UUID = $cookies.get('tpl_uuid');

    if($scope.tpl.store_credentials){
        $scope.tpl.username = $cookies.get('tpl_username');
        $scope.tpl.password = $cookies.get('tpl_password');
    }
    if($scope.tpl.store_token) {
        $scope.tpl.token = $cookies.get('tpl_token');
    }
    $scope.selected_tab_index = 0;


    if (typeof ($scope.tpl.token) === "undefined") {
        $scope.tpl.token = '';
    } else {
        $scope.tpl_refreshDevices();
    }

    $interval(function () {
        for (var i = 0; i < $scope.tpl.devices.length; i++) {
            $scope.tpl_getState(i);
        }
    }, $scope.tpl.refresh_rate * 1000);

}
