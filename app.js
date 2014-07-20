angular.module("gown", ["gown.controllers", "gown.services"]).
config([function() {}]);
angular.module("gown.controllers", []).controller("intro", ["$scope", "$http", function($scope, $http) {
    $scope.urlParams = [];
    $scope.urlDone = false;
    $scope.graph = "";
    $scope.typeDone = false;
    $scope.graphDone = false;
    
}]);
angular.module("gown.services", []);