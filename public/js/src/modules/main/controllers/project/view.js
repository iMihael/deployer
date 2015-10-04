angular.module('main').controller('projectView',  ['$scope', 'project', '$location', 'growl', '$routeParams', function($scope, project, $location, growl, $routeParams){

    console.log($scope);

    project.get({
        id: $routeParams.id
    }, function(data){
        console.log(data);
    });

}]);