angular.module('main').controller('remoteCreate',  ['$scope', 'project', '$location', 'growl', '$routeParams', 'remote',
    function($scope, project, $location, growl, $routeParams, remote){

    project.get({
        id: $routeParams.id
    }, function(data){
        $scope.project = data;
    }, function(){
        $location.path('/');
    });


    $scope.submitted = false;
    $scope.submit = function(){
        $scope.submitted = true;
        if($scope.form.$valid) {
            remote.create({
                id: $routeParams.id
            }, $scope.remote, function(){
               $location.path('/project/' + $routeParams.id);
            });
        }
    };

    $scope.remote = {
        project_keys: true,
        port: 22
    };
}]);