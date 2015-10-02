angular.module('main').controller('projectList',  ['$scope', 'project', function($scope, project){

    project.query({}, {}, function(data){
        $scope.projects = data;
    });

}]);