angular.module('main').controller('projectView',  ['$scope', 'project', '$location', 'growl', '$routeParams', 'remote', 'local_command',
    function($scope, project, $location, growl, $routeParams, remote, local_command){

    $scope.viewPath = 'js/src/modules/main/views/project/view/';
    $scope.activeTab = $routeParams.tab;

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

    $scope.local_command = {
        remove: function(id){
            local_command.delete({
                id: $routeParams.id,
                remoteId: id
            }, function(){
                for(var i in $scope.project.local_commands) {
                    if($scope.project.local_commands[i].id == id) {
                        $scope.project.local_commands.splice(i, 1);
                        break;
                    }
                }
            });
        }
    };

}]);