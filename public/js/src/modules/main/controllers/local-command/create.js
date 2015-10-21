angular.module('main').controller('localCommandCreate',  ['$scope', 'project', '$location', 'growl', '$routeParams', 'local_command',
    function($scope, project, $location, growl, $routeParams, local_command){

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
                local_command.create({
                    id: $routeParams.id
                }, $scope.local_command, function(){
                    $location.path('/project/' + $routeParams.id + '/local_commands');
                });
            }
        };

        $scope.local_command = {};
    }]);