angular.module('main').controller('uploadCreate',  ['$scope', 'project', '$location', 'growl', '$routeParams', 'upload',
    function($scope, project, $location, growl, $routeParams, upload){

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
                upload.create({
                    id: $routeParams.id
                }, $scope.upload, function(){
                    $location.path('/project/' + $routeParams.id + '/uploads');
                    growl.success('Symlink successfully added.');
                });
            }
        };

        $scope.upload = {

        };
    }]);