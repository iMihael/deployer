angular.module('main').controller('remoteCreate',  ['$scope', 'project', '$location', 'growl', '$routeParams', function($scope, project, $location, growl, $routeParams){

    project.get({
        id: $routeParams.id
    }, function(data){
        $scope.project = data;
    });

    $scope.submitted = false;
    $scope.submit = function(){
        $scope.submitted = true;
        if($scope.form.$valid) {
            console.log('submit');
        }
    };

    $scope.remote = {
        projectKeys: true,
        port: 22
    };
}]);