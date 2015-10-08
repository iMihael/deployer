angular.module('main').controller('projectList',  ['$scope', 'project', function($scope, project){

    project.query({}, {}, function(data){
        $scope.projects = data;
    });

    $scope.deleteProject = function(row) {
        project.delete({id: row._id}, function(){
            row.deleted = true;
        });
    };

    $scope.restoreProject = function(row) {
        project.restore({id: row._id}, {}, function(){
            row.deleted = false;
        });
    }

}]);