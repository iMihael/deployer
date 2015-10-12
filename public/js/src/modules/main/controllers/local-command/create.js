angular.module('main').controller('localCommandCreate',  ['$scope', 'project', '$location', 'growl', '$routeParams',
    function($scope, project, $location, growl, $routeParams){

        project.get({
            id: $routeParams.id
        }, function(data){
            $scope.project = data;
        }, function(){
            $location.path('/');
        });


        $scope.submitted = false;
        $scope.submit = function(){

        };

        $scope.local_command = {};
    }]);