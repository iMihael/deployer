angular.module('main').controller('remoteCommandCreate',  ['$scope', 'project', '$location', 'growl', '$routeParams', 'remote_command',
    function($scope, project, $location, growl, $routeParams, remote_command){

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
                remote_command.create({
                    id: $routeParams.id
                }, $scope.remote_command, function(){
                    $location.path('/project/' + $routeParams.id + '/remote_commands');
                    growl.success('Remote command successfully added.');
                });
            }
        };

        $scope.remote_command = {};
    }]);