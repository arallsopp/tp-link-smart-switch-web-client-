var app = angular.module('myApp', ['ngMaterial']);

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('custom').primaryPalette('blue-grey').accentPalette('deep-orange');
});

app.controller('dash', function ($scope, $mdToast, $http, $interval, $sce) {

    $scope.getUUID = function(){
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
    };

    $scope.UUID = $scope.getUUID();

    $scope.showToast = function (msg) {
        $mdToast.show($mdToast.simple().textContent(msg).position('top right'))
    };

});
