angular.module('main').controller('projectView',  ['$scope', 'project', '$location', 'growl', '$routeParams', function($scope, project, $location, growl, $routeParams){

    project.get({
        id: $routeParams.id
    }, function(data){
        $scope.project = data;
    });

}]);