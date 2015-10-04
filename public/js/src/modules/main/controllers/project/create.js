angular.module('main').controller('projectCreate',  ['$scope', 'project', '$location', 'growl', function($scope, project, $location, growl){

    //TODO: fix growl
    $scope.project = {};

    $scope.submitted = false;
    $scope.submit = function(){
        $scope.submitted = true;

        if($scope.form.$valid) {
            project.create($scope.project, function(){
                growl.success('Project successfully created.');
                $location.path('/');
            });
        }
    };

}]);