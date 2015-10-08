angular.module('main').controller('projectView',  ['$scope', 'project', '$location', 'growl', '$routeParams', function($scope, project, $location, growl, $routeParams){

    $scope.viewPath = 'js/src/modules/main/views/project/view/';
    $scope.activeTab = 'general';

    project.get({
        id: $routeParams.id
    }, function(data){
        $scope.project = data;
    });

}]);