angular.module('main').controller('symlinkCreate',  ['$scope', 'project', '$location', 'growl', '$routeParams', 'symlink',
    function($scope, project, $location, growl, $routeParams, symlink){

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
                symlink.create({
                    id: $routeParams.id
                }, $scope.symlink, function(){
                    $location.path('/project/' + $routeParams.id + '/symlinks');
                    growl.success('Symlink successfully added.');
                });
            }
        };

        $scope.symlink = {

        };
    }]);