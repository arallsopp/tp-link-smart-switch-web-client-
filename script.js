var app = angular.module('myApp', ['ngMaterial']);

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('custom').primaryPalette('blue-grey').accentPalette('deep-orange');
});

app.controller('dash', function ($scope, $mdToast, $http, $interval, $sce) {

    $scope.showToast = function (msg) {
        $mdToast.show($mdToast.simple().textContent(msg).position('top right'))
    };

});
