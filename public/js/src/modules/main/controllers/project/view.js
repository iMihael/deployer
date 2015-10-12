angular.module('main').controller('projectView',  ['$scope', 'project', '$location', 'growl', '$routeParams', 'remote',
    function($scope, project, $location, growl, $routeParams, remote){

    $scope.viewPath = 'js/src/modules/main/views/project/view/';
    $scope.activeTab = 'general';

    project.get({
        id: $routeParams.id
    }, function(data){
        $scope.project = data;
    });

    $scope.remote = {
        remove: function(id){
            remote.delete({
                id: $routeParams.id,
                remoteId: id
            }, function(){
                for(var i in $scope.project.remotes) {
                    if($scope.project.remotes[i].id == id) {
                        $scope.project.remotes.splice(i, 1);
                        break;
                    }
                }
            });
        }
    };

}]);